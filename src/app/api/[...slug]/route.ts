import { NextRequest, NextResponse } from 'next/server';
import {
  connectDB,
  hasDatabaseConfig,
  User,
  Project,
  Skill,
  Experience,
  Achievement,
  Profile,
  Video,
  Service,
  generateToken,
  getUserFromAuthorization,
  parseRequestBody,
  objectFromRecord,
} from '@/lib/server-data';

function parseSlug(slug: string[] | undefined) {
  return slug ?? [];
}

function makeError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

function makeConfigError() {
  return NextResponse.json(
    {
      message: 'Database is not configured for this deployment.',
      details: 'Set MONGODB_URI and JWT_SECRET in your environment before using the API.',
    },
    { status: 503 }
  );
}

async function requireAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization');
  const user = getUserFromAuthorization(auth);
  if (!user) return { ok: false, response: NextResponse.json({ message: 'Access token required' }, { status: 401 }) };
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return { ok: false, response: NextResponse.json({ message: 'Admin access required' }, { status: 403 }) };
  }
  return { ok: true, user };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    if (!hasDatabaseConfig()) return makeConfigError();
    await connectDB();
    const slug = parseSlug((await params).slug);

    if (slug[0] === 'health') return NextResponse.json({ status: 'ok', message: 'Server is running' });

    if (slug[0] === 'auth' && slug[1] === 'me') {
      const user = getUserFromAuthorization(request.headers.get('authorization'));
      if (!user) return makeError('Access token required', 401);
      const dbUser = await User.findById(user.id).lean();
      if (!dbUser) return makeError('User not found', 404);
      return NextResponse.json({ user: { id: dbUser._id.toString(), email: dbUser.email, name: dbUser.name, role: dbUser.role } });
    }

    if (slug[0] === 'auth' && slug[1] === 'users') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
      return NextResponse.json({ users });
    }

    if (slug[0] === 'profile') {
      const profile = await Profile.findOne().lean();
      if (!profile) {
        const defaultProfile = {
          _id: 'default-profile',
          name: 'Makanjuola Ebenezer',
          firstName: 'Makanjuola',
          lastName: 'Ebenezer',
          title: 'Senior Electrical Engineer',
          company: 'Nigerian Airspace Management Agency (NAMA)',
          bio: 'Electrical Engineer specializing in aviation systems maintenance, power infrastructure, and operational reliability in Nigeria.',
          tagline: 'Delivering reliable aviation and infrastructure solutions with precision and purpose.',
          profileImage: '/images/profile.jpg',
          resumeUrl: '',
          email: 'makanjuola.ebenezer@nama.gov.ng',
          phone: '+234 000 000 0000',
          interests: ['Aviation Systems', 'Power Infrastructure', 'Maintenance', 'Project Leadership'],
          location: {
            city: 'Abuja',
            state: 'Federal Capital Territory',
            country: 'Nigeria',
          },
          social: {
            linkedin: '',
            github: '',
            twitter: '',
            facebook: '',
            instagram: '',
            website: '',
          },
          stats: {
            yearsOfExperience: 5,
            projectsCompleted: 12,
            certificationsEarned: 8,
            clientsSatisfied: 15,
          },
          skills: {
            technical: [],
            soft: [],
          },
          languages: [],
          education: [],
          availability: 'available',
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({ profile: defaultProfile });
      }
      return NextResponse.json({ profile });
    }

    if (slug[0] === 'projects') {
      const projectId = slug[1];
      if (projectId) {
        const project = await Project.findById(projectId).lean();
        if (!project) return makeError('Project not found', 404);
        return NextResponse.json({ project });
      }
      const projects = await Project.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ projects });
    }

    if (slug[0] === 'skills') {
      const skillId = slug[1];
      if (skillId) {
        const skill = await Skill.findById(skillId).lean();
        if (!skill) return makeError('Skill not found', 404);
        return NextResponse.json({ skill });
      }
      const skills = await Skill.find().sort({ proficiency: -1 }).lean();
      return NextResponse.json({ skills });
    }

    if (slug[0] === 'experiences') {
      const experienceId = slug[1];
      if (experienceId) {
        const experience = await Experience.findById(experienceId).lean();
        if (!experience) return makeError('Experience not found', 404);
        return NextResponse.json({ experience });
      }
      const experiences = await Experience.find().sort({ startDate: -1 }).lean();
      return NextResponse.json({ experiences });
    }

    if (slug[0] === 'achievements') {
      const achievementId = slug[1];
      if (achievementId) {
        const achievement = await Achievement.findById(achievementId).lean();
        if (!achievement) return makeError('Achievement not found', 404);
        return NextResponse.json({ achievement });
      }
      const achievements = await Achievement.find().sort({ date: -1 }).lean();
      return NextResponse.json({ achievements });
    }

    if (slug[0] === 'services') {
      const serviceId = slug[1];
      if (serviceId) {
        const service = await Service.findById(serviceId).lean();
        if (!service) return makeError('Service not found', 404);
        return NextResponse.json(service);
      }
      const services = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
      return NextResponse.json(services);
    }

    if (slug[0] === 'videos') {
      const videoId = slug[1];
      if (videoId) {
        const video = await Video.findById(videoId).lean();
        if (!video) return makeError('Video not found', 404);
        return NextResponse.json(video);
      }
      const videos = await Video.find().sort({ featured: -1, publishedDate: -1 }).lean();
      return NextResponse.json(videos);
    }

    return makeError('Route not found', 404);
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    if (!hasDatabaseConfig()) return makeConfigError();
    await connectDB();
    const slug = parseSlug((await params).slug);
    const { body, files } = await parseRequestBody(request);

    if (slug[0] === 'auth' && slug[1] === 'register') {
      const data = objectFromRecord(body);
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) return makeError('User already exists', 409);
      const firstUser = (await User.countDocuments()) === 0;
      const user = await User.create({
        email: data.email,
        password: data.password,
        name: data.name,
        role: firstUser ? 'superadmin' : 'viewer',
      });
      const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
      return NextResponse.json({ message: 'User registered successfully', token, user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } }, { status: 201 });
    }

    if (slug[0] === 'auth' && slug[1] === 'login') {
      const data = objectFromRecord(body);
      const user = await User.findOne({ email: data.email.toLowerCase() });
      if (!user) return makeError('Invalid email or password', 401);
      const valid = await user.comparePassword(data.password);
      if (!valid) return makeError('Invalid email or password', 401);
      user.lastLogin = new Date();
      await user.save();
      const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
      return NextResponse.json({ message: 'Login successful', token, user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } });
    }

    if (slug[0] === 'auth' && slug[1] === 'users') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      const user = await User.create({ email: data.email, password: data.password, name: data.name, role: data.role || 'viewer' });
      return NextResponse.json({ message: 'User created successfully', user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } }, { status: 201 });
    }

    if (slug[0] === 'projects') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.imageUrl) data.imageUrl = files.imageUrl[0];
      if (files?.images) data.images = files.images;
      const project = await Project.create(data);
      return NextResponse.json({ message: 'Project created successfully', project }, { status: 201 });
    }

    if (slug[0] === 'skills') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (slug[1] === 'bulk') {
        const skills = Array.isArray(data.skills) ? data.skills : [];
        const createdSkills = await Skill.insertMany(skills);
        return NextResponse.json({ message: `${createdSkills.length} skills created successfully`, skills: createdSkills }, { status: 201 });
      }
      const skill = await Skill.create(data);
      return NextResponse.json({ message: 'Skill created successfully', skill }, { status: 201 });
    }

    if (slug[0] === 'experiences') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.companyLogo) data.companyLogo = files.companyLogo[0];
      const experience = await Experience.create(data);
      return NextResponse.json({ message: 'Experience created successfully', experience }, { status: 201 });
    }

    if (slug[0] === 'achievements') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.achievement) data.imageUrl = files.achievement[0];
      if (files?.document) data.documentUrl = files.document[0];
      const achievement = await Achievement.create(data);
      return NextResponse.json({ message: 'Achievement created successfully', achievement }, { status: 201 });
    }

    if (slug[0] === 'services') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      const service = await Service.create(data);
      return NextResponse.json(service, { status: 201 });
    }

    if (slug[0] === 'videos') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.thumbnail) data.thumbnailUrl = files.thumbnail[0];
      if (files?.video) data.videoUrl = files.video[0];
      const video = await Video.create(data);
      return NextResponse.json(video, { status: 201 });
    }

    return makeError('Route not found', 404);
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    if (!hasDatabaseConfig()) return makeConfigError();
    await connectDB();
    const slug = parseSlug((await params).slug);
    const { body, files } = await parseRequestBody(request);

    if (slug[0] === 'auth' && slug[1] === 'change-password') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      const user = await User.findById(authCheck.user.id);
      if (!user) return makeError('User not found', 404);
      user.password = data.newPassword;
      await user.save();
      return NextResponse.json({ message: 'Password updated successfully' });
    }

    if (slug[0] === 'profile') {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.profileImage) data.profileImage = files.profileImage[0];
      if (files?.resume) data.resumeUrl = files.resume[0];
      const profile = await Profile.findOne();
      if (!profile) {
        const created = await Profile.create(data);
        return NextResponse.json({ message: 'Profile created successfully', profile: created });
      }
      Object.assign(profile, data);
      await profile.save();
      return NextResponse.json({ message: 'Profile updated successfully', profile });
    }

    if (slug[0] === 'projects' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.imageUrl) data.imageUrl = files.imageUrl[0];
      if (files?.images) data.images = files.images;
      const project = await Project.findByIdAndUpdate(slug[1], data, { new: true, runValidators: true });
      if (!project) return makeError('Project not found', 404);
      return NextResponse.json({ message: 'Project updated successfully', project });
    }

    if (slug[0] === 'skills' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      const skill = await Skill.findByIdAndUpdate(slug[1], data, { new: true, runValidators: true });
      if (!skill) return makeError('Skill not found', 404);
      return NextResponse.json({ message: 'Skill updated successfully', skill });
    }

    if (slug[0] === 'experiences' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.companyLogo) data.companyLogo = files.companyLogo[0];
      const experience = await Experience.findByIdAndUpdate(slug[1], data, { new: true, runValidators: true });
      if (!experience) return makeError('Experience not found', 404);
      return NextResponse.json({ message: 'Experience updated successfully', experience });
    }

    if (slug[0] === 'achievements' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.achievement) data.imageUrl = files.achievement[0];
      if (files?.document) data.documentUrl = files.document[0];
      const achievement = await Achievement.findByIdAndUpdate(slug[1], data, { new: true, runValidators: true });
      if (!achievement) return makeError('Achievement not found', 404);
      return NextResponse.json({ message: 'Achievement updated successfully', achievement });
    }

    if (slug[0] === 'services' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      const service = await Service.findByIdAndUpdate(slug[1], data, { new: true, runValidators: true });
      if (!service) return makeError('Service not found', 404);
      return NextResponse.json(service);
    }

    if (slug[0] === 'videos' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      const data = objectFromRecord(body);
      if (files?.thumbnail) data.thumbnailUrl = files.thumbnail[0];
      if (files?.video) data.videoUrl = files.video[0];
      const video = await Video.findByIdAndUpdate(slug[1], data, { new: true, runValidators: true });
      if (!video) return makeError('Video not found', 404);
      return NextResponse.json(video);
    }

    return makeError('Route not found', 404);
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  try {
    if (!hasDatabaseConfig()) return makeConfigError();
    await connectDB();
    const slug = parseSlug((await params).slug);

    if (slug[0] === 'auth' && slug[1] === 'users' && slug[2]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await User.findByIdAndDelete(slug[2]);
      return NextResponse.json({ message: 'User deleted successfully' });
    }

    if (slug[0] === 'projects' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await Project.findByIdAndDelete(slug[1]);
      return NextResponse.json({ message: 'Project deleted successfully' });
    }

    if (slug[0] === 'skills' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await Skill.findByIdAndDelete(slug[1]);
      return NextResponse.json({ message: 'Skill deleted successfully' });
    }

    if (slug[0] === 'experiences' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await Experience.findByIdAndDelete(slug[1]);
      return NextResponse.json({ message: 'Experience deleted successfully' });
    }

    if (slug[0] === 'achievements' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await Achievement.findByIdAndDelete(slug[1]);
      return NextResponse.json({ message: 'Achievement deleted successfully' });
    }

    if (slug[0] === 'services' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await Service.findByIdAndDelete(slug[1]);
      return NextResponse.json({ message: 'Service deleted successfully' });
    }

    if (slug[0] === 'videos' && slug[1]) {
      const authCheck = await requireAdmin(request);
      if (!authCheck.ok) return authCheck.response;
      await Video.findByIdAndDelete(slug[1]);
      return NextResponse.json({ message: 'Video deleted successfully' });
    }

    return makeError('Route not found', 404);
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
