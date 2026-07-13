import Admin from './models/Admin';
import Project from './models/Project';
import Service from './models/Service';
import Partner from './models/Partner';
import TeamMember from './models/TeamMember';
import JobPosition from './models/JobPosition';
import SiteSettings from './models/SiteSettings';
import PageContent from './models/PageContent';
import SuccessStory from './models/SuccessStory';

export async function autoSeed(): Promise<void> {
  console.log('🌱 Auto-seeding in-memory database...');

  await Admin.create({ username: 'admin', password: 'admin123' });

  await Project.insertMany([
    {
      title: 'Lilongwe Grand Bridge', category: 'Infrastructure', location: 'Lilongwe, Malawi',
      duration: '24 Months', budget: '$15M USD',
      challenge: 'Constructing a multi-lane bridge across the Lilongwe River during the rainy season.',
      solution: 'Implemented advanced deep foundation techniques using steel piles.',
      result: 'Completed 2 months ahead of schedule with zero-incident safety record.',
      coverImage: 'https://images.unsplash.com/photo-1545558014-8ab6aa17e307?q=80&w=1200',
      galleryImages: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800'],
      completionDate: 'October 2024',
    },
    {
      title: 'National Commercial Hub', category: 'Commercial', location: 'Blantyre, Malawi',
      duration: '18 Months', budget: '$22M USD',
      challenge: 'Building a 15-story modern commercial skyscraper in a dense urban area.',
      solution: 'Utilized just-in-time material delivery and quiet construction technologies.',
      result: "Delivered Malawi's first LEED-certified commercial building.",
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200',
      galleryImages: [],
      completionDate: 'March 2025',
    },
    {
      title: 'Mzuzu Highway Expansion', category: 'Infrastructure', location: 'Mzuzu to Nkhata Bay',
      duration: '36 Months', budget: '$45M USD',
      challenge: 'Upgrading a critical 50km mountainous road prone to landslides.',
      solution: 'Engineered robust retaining walls and improved drainage systems.',
      result: 'Reduced travel time by 40% and stimulated local economic growth.',
      coverImage: 'https://images.unsplash.com/photo-1590486803622-92fd0d97034c?q=80&w=1200',
      galleryImages: [],
      completionDate: 'December 2023',
    },
  ]);

  await Service.insertMany([
    { title: 'Roads & Infrastructure', tagline: 'Connecting Malawi, Mile by Mile', description: "From rural feeder roads to major national highways, we engineer and construct road infrastructure that withstands Malawi's diverse terrain.", features: ['Highway Construction', 'Drainage Systems', 'Bridges & Culverts', 'Road Rehabilitation'], bgImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800', order: 1 },
    { title: 'Building & Commercial Construction', tagline: 'Spaces That Work and Inspire', description: 'We deliver commercial offices, government facilities, schools, hospitals, and residential estates.', features: ['Commercial Offices', 'Government Facilities', 'Residential Estates', 'Educational Institutions'], bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', order: 2 },
    { title: 'Bridges & Structural Works', tagline: 'Engineering That Endures Generations', description: 'Complex structural projects demand exceptional engineering. We plan, design, and construct bridges that stand the test of time.', features: ['RC Bridge Construction', 'Steel Structures', 'Retaining Walls', 'Structural Rehabilitation'], bgImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', order: 3 },
  ]);

  await Partner.insertMany([
    { name: 'Ministry of Public Works', abbr: 'MPW', order: 1 },
    { name: 'African Development Bank', abbr: 'AfDB', order: 2 },
    { name: 'World Bank Group', abbr: 'WBG', order: 3 },
    { name: 'JICA Malawi', abbr: 'JICA', order: 4 },
    { name: 'EU Development', abbr: 'EU', order: 5 },
    { name: 'ROADS Authority', abbr: 'RA', order: 6 },
  ]);

  await TeamMember.insertMany([
    { name: 'David Chen', role: 'Managing Director', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800', bio: 'Over 25 years of experience leading major infrastructure projects across East Africa.', order: 1 },
    { name: 'Sarah Banda', role: 'Head of Operations', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800', bio: 'Expert in project logistics and operational excellence with a track record of on-time delivery.', order: 2 },
    { name: 'Michael Tembo', role: 'Chief Engineer', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800', bio: 'Structural engineering specialist with deep expertise in bridge and highway construction.', order: 3 },
    { name: 'Elena Phiri', role: 'HSE Director', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800', bio: 'NEBOSH-certified safety professional ensuring zero-harm culture across all project sites.', order: 4 },
  ]);

  await JobPosition.insertMany([
    { title: 'Senior Civil Engineer', location: 'Lilongwe', type: 'Full-time', description: 'Lead civil engineering projects from design through completion.', requirements: ['B.Sc. Civil Engineering', '5+ years experience', 'AutoCAD proficiency'], isActive: true },
    { title: 'Construction Project Manager', location: 'Various Sites', type: 'Full-time', description: 'Oversee major construction projects ensuring delivery on time and budget.', requirements: ['PMP Certified', '7+ years experience'], isActive: true },
    { title: 'HSE Officer', location: 'Blantyre', type: 'Full-time', description: 'Implement and monitor health, safety and environmental policies on site.', requirements: ['NEBOSH Certificate', '3+ years HSE experience'], isActive: true },
  ]);

  await SiteSettings.create({
    companyName: 'Fortune Construction', tagline: "Malawi's premier construction company since 2004.",
    phone: '+265 1 234 5678', email: 'info@fortuneconstruction.mw',
    address: 'Area 4, Lilongwe, Malawi', foundedYear: 2004,
    heroTitle: 'Crafting Visionary Infrastructure.', heroBadge: '20 Years of Construction Excellence',
    heroSubtitle: 'Fortune Construction Limited delivers world-class civil engineering across Malawi.',
    socialFacebook: '', socialTwitter: '', socialLinkedin: '', socialYoutube: '',
    workingDays: 'Mon – Fri', workingHoursStart: '07:30', workingHoursEnd: '17:00',
    workingHoursDisplay: 'Mon – Fri: 7:30am – 5:00pm',
  });

  await SuccessStory.insertMany([
    {
      quote: 'Fortune Construction delivered our road rehabilitation project on time and to the highest standard. Their professionalism and technical capability is unmatched in Malawi.',
      author: 'Principal Secretary',
      org: 'Ministry of Transport, Malawi',
      initials: 'PS',
      order: 1,
    },
    {
      quote: "The bridge project was complex, but Fortune's engineering team navigated every challenge with expertise. We've worked with them on three major contracts and they consistently exceed expectations.",
      author: 'Regional Director',
      org: 'Roads Authority, Malawi',
      initials: 'RD',
      order: 2,
    },
    {
      quote: 'Their commitment to safety and quality is remarkable. Fortune Construction has set the benchmark for infrastructure development in the region.',
      author: 'Country Representative',
      org: 'World Bank Group, Malawi',
      initials: 'CR',
      order: 3,
    },
  ]);

  // --- Page Content ---
  await PageContent.insertMany([
    // HOME — Hero
    {
      page: 'home', section: 'hero',
      content: {
        badge: '20 Years of Construction Excellence',
        title: 'Crafting Visionary Infrastructure.',
        subtitle: 'Fortune Construction Limited delivers world-class civil engineering across Malawi, building the bedrock of national progress.',
        videos: [
          { url: '/assets/videos/vedio1.mp4' },
          { url: '/assets/videos/vedio2.mp4' },
          { url: '/assets/videos/vedio3.mp4' },
        ],
      },
    },
    // HOME — Impact
    {
      page: 'home', section: 'impactMetrics',
      content: {
        title: 'Two Decades of Building a Stronger Malawi',
        subtitle: 'Our Impact',
        description: 'Our numbers tell a story of commitment, craftsmanship, and community transformation.',
        items: [
          { target: 1500, suffix: '+', label: 'KM of Roads Paved', description: 'Connecting communities across all regions of Malawi with durable, engineered roads.', icon: 'Route' },
          { target: 2000, suffix: '+', label: 'Families Housed', description: 'Quality residential and social housing projects delivered on time and on budget.', icon: 'Home' },
          { target: 20, suffix: '+', label: 'Years of Experience', description: 'Two decades of expertise in civil, structural, and commercial construction.', icon: 'Clock' },
          { target: 500, suffix: '+', label: 'Successful Projects', description: 'A proven track record of successful delivery for government and private clients.', icon: 'CheckCircle' },
        ],
      },
    },
    // ABOUT
    {
      page: 'about', section: 'vision',
      content: {
        title: 'Our Vision',
        description: 'To be the premier civil engineering and construction firm in East Africa, recognized for delivering world-class infrastructure that drives economic growth and improves the quality of life in the communities we serve.',
      },
    },
    {
      page: 'about', section: 'mission',
      content: {
        title: 'Our Mission',
        description: 'To provide exceptional construction services through innovation, rigorous quality control, and an uncompromising commitment to Health, Safety, and Environment (HSE) standards, ensuring every project stands the test of time.',
      },
    },
    {
      page: 'about', section: 'timeline',
      content: {
        title: 'A Legacy of Excellence',
        subtitle: 'Our Journey',
        items: [
          { year: '2006', title: 'Company Founded', desc: 'Established in Lilongwe as a specialized contractor for residential projects.' },
          { year: '2012', title: 'First Government Contract', desc: 'Awarded a major road infrastructure project, marking our entry into the public sector.' },
          { year: '2018', title: 'ISO Certification', desc: 'Achieved international recognition for quality management and safety standards.' },
          { year: '2026', title: 'National Leader', desc: 'Celebrating 20 years with over 150 completed landmark projects across Malawi.' },
        ],
      },
    },
    {
      page: 'about', section: 'coreValues',
      content: {
        title: 'Our Core Values',
        subtitle: 'What Drives Us',
        items: [
          { title: 'Safety First', desc: 'Zero compromises when it comes to the health and safety of our workforce and the public.', icon: 'Shield' },
          { title: 'Uncompromising Quality', desc: 'Rigorous material testing and engineering precision in every phase of construction.', icon: 'CheckCircle' },
          { title: 'Community Impact', desc: 'Building sustainably and empowering local talent to foster long-term national development.', icon: 'Users' },
        ],
      },
    },
    // HSE
    {
      page: 'hse', section: 'policies',
      content: {
        items: [
          { title: 'Health & Safety', description: 'Our "Zero Harm" policy ensures rigorous training, daily site briefings, and strict adherence to international safety protocols. Every worker returns home safely, every day.', icon: 'ShieldCheck' },
          { title: 'Quality Control', description: 'We source premium materials, conduct exhaustive structural testing, and utilize advanced engineering technologies to guarantee the longevity and resilience of our infrastructure.', icon: 'HardHat' },
          { title: 'Environmental Policy', description: 'Dedicated to preserving Malawi\'s natural beauty, we minimize construction waste, optimize resource efficiency, and actively implement sustainable building practices.', icon: 'Leaf' },
        ],
      },
    },
    {
      page: 'hse', section: 'safetyStats',
      content: {
        items: [
          { value: '1M+', label: 'Man-hours Without LTI' },
          { value: '100%', label: 'Workers HSE Certified' },
          { value: 'ISO', label: '9001:2015 Compliant' },
        ],
      },
    },
    {
      page: 'hse', section: 'certifications',
      content: {
        title: 'Our Accreditations',
        subtitle: 'Recognized Excellence',
        description: 'We operate strictly according to international standards for quality management and occupational safety.',
        items: [
          { title: 'ISO 9001:2015' },
          { title: 'ISO 14001:2015' },
          { title: 'ISO 45001:2018' },
          { title: 'NEBOSH Certified' },
        ],
      },
    },
    // CAREERS
    {
      page: 'careers', section: 'benefits',
      content: {
        title: 'More Than Just a Job',
        subtitle: 'Why Join Us',
        items: [
          { title: 'Career Growth', desc: 'Clear progression paths and continuous professional development programs.', icon: 'TrendingUp' },
          { title: 'Major Projects', desc: 'Work on landmark infrastructure that shapes the future of Malawi.', icon: 'Building2' },
          { title: 'Competitive Package', desc: 'Industry-leading salary, health insurance, and performance bonuses.', icon: 'Briefcase' },
          { title: 'Safety First Culture', desc: 'A work environment where your health and wellbeing are the top priority.', icon: 'HardHat' },
        ],
      },
    },
  ]);

  console.log('✅ Auto-seed complete — login: admin / admin123');
}
