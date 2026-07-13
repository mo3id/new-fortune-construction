import { Button, Input } from '@fortune/shared-ui'

export function Newsletter() {
    return (
        <div className="md:col-span-1">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-teal-500 mb-8">Global Newsletter</p>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-light">
                Receive exclusive updates on national infrastructure milestones and corporate insights.
            </p>
            <div className="space-y-4">
                <Input
                    type="email"
                    placeholder="executive@corporate.com"
                    className="w-full bg-white/5 border-white/10 rounded-xl text-white placeholder:text-slate-600 focus-visible:border-teal-500 focus-visible:ring-teal-500/10 h-14 px-6 transition-all duration-300"
                />
                <Button
                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold uppercase tracking-widest text-[10px] h-14 shadow-lg shadow-teal-500/10 transition-all duration-500"
                >
                    Subscribe to Insights
                </Button>
            </div>
        </div>
    )
}
