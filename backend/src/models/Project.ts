import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  imageUrl: String,
  projectUrl: String,
  githubUrl: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Project', ProjectSchema);
