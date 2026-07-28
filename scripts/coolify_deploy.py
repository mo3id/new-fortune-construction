#!/usr/bin/env python3

import argparse
import json
import secrets
import string
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, List, Optional


def random_secret(length: int = 48) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def normalize_repository(repository: str) -> str:
    value = repository.strip().rstrip("/")
    prefixes = (
        "https://github.com/",
        "http://github.com/",
        "git@github.com:",
        "ssh://git@github.com/",
    )
    for prefix in prefixes:
        if value.startswith(prefix):
            value = value[len(prefix):]
            break
    if value.endswith(".git"):
        value = value[:-4]
    return value


class CoolifyClient:
    def __init__(self, base_url: str, token: str) -> None:
        self.base_url = base_url.rstrip("/") + "/api/v1"
        self.token = token

    def request(self, method: str, path: str, data=None, expected=None):
        url = f"{self.base_url}{path}"
        body = None if data is None else json.dumps(data).encode("utf-8")
        request = urllib.request.Request(url, data=body, method=method)
        request.add_header("Authorization", f"Bearer {self.token}")
        request.add_header("Accept", "application/json")
        if body is not None:
            request.add_header("Content-Type", "application/json")

        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                raw = response.read().decode("utf-8")
                status = response.status
        except urllib.error.HTTPError as exc:
            raw = exc.read().decode("utf-8", errors="replace")
            try:
                detail = json.loads(raw)
            except Exception:
                detail = raw
            raise RuntimeError(f"{method} {path} failed with {exc.code}: {detail}") from None

        if expected is not None:
            allowed = expected if isinstance(expected, (list, tuple, set)) else [expected]
            if status not in allowed:
                raise RuntimeError(f"{method} {path} returned unexpected status {status}: {raw}")

        if not raw:
            return None
        try:
            return json.loads(raw)
        except Exception:
            return raw


def find_by_name(items, name):
    return next((item for item in items if item.get("name") == name), None)


def get_env_map(client: CoolifyClient, app_uuid: str):
    envs = client.request("GET", f"/applications/{app_uuid}/envs", expected=200)
    return {item.get("key"): item for item in envs}


def wait_for_database(client: CoolifyClient, database_uuid: str, timeout: int) -> dict:
    deadline = time.time() + timeout
    last_status = None
    while time.time() < deadline:
        database = client.request("GET", f"/databases/{database_uuid}", expected=200)
        status = (database.get("status") or "").lower()
        if status != last_status:
            print(f"Database status: {status or 'unknown'}", flush=True)
            last_status = status
        if "running" in status:
            return database
        time.sleep(5)
    raise RuntimeError(f"Database {database_uuid} did not reach running state within {timeout}s")


def wait_for_deployment(client: CoolifyClient, deployment_uuid: str, timeout: int) -> dict:
    deadline = time.time() + timeout
    last_status = None
    while time.time() < deadline:
        deployment = client.request("GET", f"/deployments/{deployment_uuid}", expected=200)
        status = (deployment.get("status") or "").lower()
        if status != last_status:
            print(f"Deployment {deployment_uuid}: {status or 'unknown'}", flush=True)
            last_status = status
        if status in {"finished", "success", "succeeded"}:
            return deployment
        if status in {"failed", "error", "skipped", "canceled", "cancelled"}:
            raise RuntimeError(f"Deployment {deployment_uuid} ended with status {status}")
        time.sleep(10)
    raise RuntimeError(f"Deployment {deployment_uuid} did not finish within {timeout}s")


def ensure_project(client: CoolifyClient, name: str, description: str) -> dict:
    projects = client.request("GET", "/projects", expected=200)
    project = find_by_name(projects, name)
    if project:
        print(f"Using existing project: {project['name']} ({project['uuid']})", flush=True)
        return project
    created = client.request(
        "POST",
        "/projects",
        {"name": name, "description": description},
        expected=201,
    )
    project = {"name": name, "uuid": created["uuid"]}
    print(f"Created project: {project['name']} ({project['uuid']})", flush=True)
    return project


def ensure_environment(client: CoolifyClient, project_uuid: str, name: str) -> dict:
    environments = client.request("GET", f"/projects/{project_uuid}/environments", expected=200)
    environment = find_by_name(environments, name)
    if environment:
        print(f"Using environment: {environment['name']} ({environment['uuid']})", flush=True)
        return environment
    created = client.request(
        "POST",
        f"/projects/{project_uuid}/environments",
        {"name": name},
        expected=201,
    )
    environment = {"name": name, "uuid": created["uuid"]}
    print(f"Created environment: {environment['name']} ({environment['uuid']})", flush=True)
    return environment


def get_destination_uuid(client: CoolifyClient, server_uuid: str):
    server = client.request("GET", f"/servers/{server_uuid}", expected=200)
    destinations = server.get("destinations") or []
    if not destinations:
        print("Server has no explicit destination UUID in API response; using Coolify default.", flush=True)
        return None
    if len(destinations) > 1:
        print(f"Server has multiple destinations; using the first one: {destinations[0]['uuid']}", flush=True)
    else:
        print(f"Using destination: {destinations[0]['uuid']}", flush=True)
    return destinations[0]["uuid"]


def ensure_mongodb(client: CoolifyClient, args, destination_uuid: Optional[str]) -> dict:
    env_detail = client.request("GET", f"/projects/{args.project_uuid}/{urllib.parse.quote(args.environment_name)}", expected=200)
    existing = find_by_name(env_detail.get("mongodbs") or [], args.mongodb_name)
    if existing:
        database = client.request("GET", f"/databases/{existing['uuid']}", expected=200)
        password = database.get("mongo_initdb_root_password")
        if not password:
            raise RuntimeError("Existing MongoDB resource found, but its password is not available through the API.")
        print(f"Using existing MongoDB: {database['name']} ({database['uuid']})", flush=True)
        return {
            "uuid": database["uuid"],
            "username": database.get("mongo_initdb_root_username") or args.mongodb_user,
            "password": password,
            "database": database.get("mongo_initdb_database") or args.mongodb_database,
            "status": database.get("status") or "",
        }

    payload = {
        "server_uuid": args.server_uuid,
        "project_uuid": args.project_uuid,
        "environment_name": args.environment_name,
        "name": args.mongodb_name,
        "description": "MongoDB for Fortune Construction API",
        "mongo_initdb_root_username": args.mongodb_user,
        "mongo_initdb_root_password": args.mongodb_password,
        "mongo_initdb_database": args.mongodb_database,
        "instant_deploy": False,
    }
    if destination_uuid:
        payload["destination_uuid"] = destination_uuid

    created = client.request("POST", "/databases/mongodb", payload, expected=201)
    print(f"Created MongoDB: {created['uuid']}", flush=True)
    return {
        "uuid": created["uuid"],
        "username": args.mongodb_user,
        "password": args.mongodb_password,
        "database": args.mongodb_database,
        "status": "exited",
    }


def ensure_application(client: CoolifyClient, args, destination_uuid: Optional[str], existing_apps, spec: Dict[str, object]) -> str:
    create_payload = {
        "project_uuid": args.project_uuid,
        "environment_name": args.environment_name,
        "server_uuid": args.server_uuid,
        "git_repository": args.repo,
        "git_branch": args.branch,
        "name": spec["name"],
        "description": spec["description"],
        "domains": spec["domain"],
    }
    update_payload = {
        "git_repository": args.repo,
        "git_branch": args.branch,
        "name": spec["name"],
        "description": spec["description"],
        "domains": spec["domain"],
    }

    optional_fields = [
        "build_pack",
        "ports_exposes",
        "base_directory",
        "dockerfile_location",
        "install_command",
        "build_command",
        "start_command",
        "publish_directory",
        "health_check_enabled",
        "health_check_path",
        "health_check_port",
        "custom_docker_run_options",
        "is_static",
        "is_spa",
    ]
    for field in optional_fields:
        if spec.get(field) is not None:
            create_payload[field] = spec[field]
            update_payload[field] = spec[field]

    if destination_uuid:
        create_payload["destination_uuid"] = destination_uuid

    existing = find_by_name(existing_apps, spec["name"])
    if existing:
        client.request("PATCH", f"/applications/{existing['uuid']}", update_payload, expected=200)
        print(f"Updated application: {spec['name']} ({existing['uuid']})", flush=True)
        return existing["uuid"]

    created = client.request("POST", "/applications/public", create_payload, expected=201)
    print(f"Created application: {spec['name']} ({created['uuid']})", flush=True)
    return created["uuid"]


def upsert_application_envs(client: CoolifyClient, app_uuid: str, items: List[Dict[str, object]]) -> None:
    client.request("PATCH", f"/applications/{app_uuid}/envs/bulk", {"data": items}, expected=201)


def build_mongo_uri(mongo: dict) -> str:
    username = urllib.parse.quote(mongo["username"], safe="")
    password = urllib.parse.quote(mongo["password"], safe="")
    database = urllib.parse.quote(mongo["database"], safe="")
    return f"mongodb://{username}:{password}@{mongo['uuid']}:27017/{database}?directConnection=true"


def ensure_application_envs(client: CoolifyClient, website_uuid: str, dashboard_uuid: str, api_uuid: str, mongo: dict) -> dict:
    frontend_payload = [
        {
            "key": "VITE_API_URL",
            "value": args.api_domain,
            "is_buildtime": True,
            "is_runtime": False,
            "is_preview": False,
        },
        {
            "key": "NIXPACKS_NODE_VERSION",
            "value": "20",
            "is_buildtime": True,
            "is_runtime": False,
            "is_preview": False,
        }
    ]

    api_existing = get_env_map(client, api_uuid)
    jwt_secret = api_existing.get("JWT_SECRET", {}).get("value") or args.jwt_secret
    jwt_expires_in = api_existing.get("JWT_EXPIRES_IN", {}).get("value") or args.jwt_expires_in
    mongo_uri = build_mongo_uri(mongo)

    api_payload = [
        {
            "key": "NIXPACKS_NODE_VERSION",
            "value": "20",
            "is_buildtime": True,
            "is_runtime": False,
            "is_preview": False,
        },
        {
            "key": "MONGODB_URI",
            "value": mongo_uri,
            "is_buildtime": False,
            "is_runtime": True,
            "is_preview": False,
        },
        {
            "key": "JWT_SECRET",
            "value": jwt_secret,
            "is_buildtime": False,
            "is_runtime": True,
            "is_preview": False,
        },
        {
            "key": "JWT_EXPIRES_IN",
            "value": jwt_expires_in,
            "is_buildtime": False,
            "is_runtime": True,
            "is_preview": False,
        },
        {
            "key": "PORT",
            "value": "3001",
            "is_buildtime": False,
            "is_runtime": True,
            "is_preview": False,
        },
    ]

    upsert_application_envs(client, website_uuid, frontend_payload)
    print("Upserted website build environment.", flush=True)
    upsert_application_envs(client, dashboard_uuid, frontend_payload)
    print("Upserted dashboard build environment.", flush=True)
    upsert_application_envs(client, api_uuid, api_payload)
    print("Upserted API runtime environment.", flush=True)

    return {
        "mongo_uri": mongo_uri,
        "jwt_secret": jwt_secret,
        "jwt_expires_in": jwt_expires_in,
    }


def deploy_application(client: CoolifyClient, app_uuid: str, name: str, timeout: int) -> dict:
    response = client.request("GET", f"/applications/{app_uuid}/start", expected=200)
    deployment_uuid = response.get("deployment_uuid")
    if not deployment_uuid:
        raise RuntimeError(f"No deployment UUID returned for {name}: {response}")
    print(f"Started deployment for {name}: {deployment_uuid}", flush=True)
    wait_for_deployment(client, deployment_uuid, timeout)
    application = client.request("GET", f"/applications/{app_uuid}", expected=200)
    print(f"Application {name} status: {application.get('status')}", flush=True)
    return application


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Provision and deploy Fortune Construction on Coolify.")
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--token", required=True)
    parser.add_argument("--server-uuid", required=True)
    parser.add_argument("--project-name", default="Fortune Construction")
    parser.add_argument("--environment-name", default="production")
    parser.add_argument("--repo", default="https://github.com/AbdelrahmanYosry2022/fortune-construction.git")
    parser.add_argument("--branch", default="main")
    parser.add_argument("--site-domain", default="https://www.fortuneconstruction.net")
    parser.add_argument("--dashboard-domain", default="https://admin.fortuneconstruction.net")
    parser.add_argument("--api-domain", default="https://api.fortuneconstruction.net")
    parser.add_argument("--mongodb-name", default="fortune-mongodb")
    parser.add_argument("--mongodb-user", default="fortuneadmin")
    parser.add_argument("--mongodb-password", default=random_secret(32))
    parser.add_argument("--mongodb-database", default="fortuneconstruction")
    parser.add_argument("--jwt-secret", default=random_secret(64))
    parser.add_argument("--jwt-expires-in", default="24h")
    parser.add_argument("--database-timeout", type=int, default=600)
    parser.add_argument("--deployment-timeout", type=int, default=1800)
    return parser.parse_args()


def main() -> int:
    global args
    args = parse_args()
    args.repo = normalize_repository(args.repo)
    client = CoolifyClient(args.base_url, args.token)

    project = ensure_project(client, args.project_name, "Production deployment for fortuneconstruction.net")
    args.project_uuid = project["uuid"]

    environment = ensure_environment(client, project["uuid"], args.environment_name)
    args.environment_uuid = environment["uuid"]

    destination_uuid = get_destination_uuid(client, args.server_uuid)
    mongo = ensure_mongodb(client, args, destination_uuid)

    if "running" not in str(mongo.get("status") or "").lower():
        client.request("GET", f"/databases/{mongo['uuid']}/start", expected=200)
        print(f"Started MongoDB resource: {mongo['uuid']}", flush=True)
    wait_for_database(client, mongo["uuid"], args.database_timeout)

    env_detail = client.request(
        "GET",
        f"/projects/{project['uuid']}/{urllib.parse.quote(args.environment_name)}",
        expected=200,
    )
    existing_apps = env_detail.get("applications") or []
    specs = [
        {
            "name": "fortune-website",
            "description": "Main public website",
            "build_pack": "nixpacks",
            "ports_exposes": "3000",
            "domain": args.site_domain,
            "base_directory": "/",
            "install_command": "npm ci",
            "build_command": "npm run build",
            "start_command": "npm run preview -- --host 0.0.0.0 --port 3000",
            "health_check_enabled": False,
        },
        {
            "name": "fortune-dashboard",
            "description": "Admin dashboard",
            "build_pack": "nixpacks",
            "ports_exposes": "3000",
            "domain": args.dashboard_domain,
            "base_directory": "/",
            "install_command": "npm ci",
            "build_command": "npm run build --workspace=apps/dashboard",
            "start_command": "npm run preview --workspace=apps/dashboard -- --host 0.0.0.0 --port 3000",
            "health_check_enabled": False,
        },
        {
            "name": "fortune-api",
            "description": "Express API backend",
            "build_pack": "nixpacks",
            "ports_exposes": "3001",
            "domain": args.api_domain,
            "base_directory": "/",
            "install_command": "npm ci",
            "build_command": "npm run build --workspace=apps/api",
            "start_command": "node apps/api/dist/index.js",
            "health_check_enabled": True,
            "health_check_path": "/health",
            "health_check_port": "3001",
            "custom_docker_run_options": "-v fortune-api-uploads:/app/apps/api/uploads",
        },
    ]

    uuids = {}
    for spec in specs:
        uuids[spec["name"]] = ensure_application(client, args, destination_uuid, existing_apps, spec)

    env_summary = ensure_application_envs(
        client,
        uuids["fortune-website"],
        uuids["fortune-dashboard"],
        uuids["fortune-api"],
        mongo,
    )

    api_app = deploy_application(client, uuids["fortune-api"], "fortune-api", args.deployment_timeout)
    website_app = deploy_application(client, uuids["fortune-website"], "fortune-website", args.deployment_timeout)
    dashboard_app = deploy_application(client, uuids["fortune-dashboard"], "fortune-dashboard", args.deployment_timeout)

    summary = {
        "project_uuid": project["uuid"],
        "environment_uuid": environment["uuid"],
        "destination_uuid": destination_uuid,
        "mongodb_uuid": mongo["uuid"],
        "website_uuid": uuids["fortune-website"],
        "dashboard_uuid": uuids["fortune-dashboard"],
        "api_uuid": uuids["fortune-api"],
        "website_status": website_app.get("status"),
        "dashboard_status": dashboard_app.get("status"),
        "api_status": api_app.get("status"),
        "mongo_uri": env_summary["mongo_uri"],
        "jwt_expires_in": env_summary["jwt_expires_in"],
    }
    print("DEPLOYMENT_SUMMARY=" + json.dumps(summary, ensure_ascii=True), flush=True)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr, flush=True)
        raise SystemExit(1)