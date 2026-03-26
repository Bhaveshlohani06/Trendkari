import Post from '../models/postmodel.js';
import User from '../models/usermodel.js';
import Category from '../models/categorymodel.js';
import main from "../config/gemini.js";


export const performBasicSearch = async (query) => {
  const posts = await Post.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ],
    status: 'published'
  })
    .populate('author', 'name avatar')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(15);

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { bio: { $regex: query, $options: 'i' } }
    ]
  }).select('name avatar bio followersCount')
    .limit(8);

  const categories = await Category.find({
    name: { $regex: query, $options: 'i' }
  }).limit(5);

  return { posts, users, categories };
};







export const enhanceResults = async (query, results) => {
  try {
    const prompt = `
User Query: "${query}"

Posts found: ${results.posts.length}
Users found: ${results.users.length}

Top posts:
${results.posts.slice(0, 3).map(p => p.title).join(", ")}

Give JSON:
{
  "summary": "",
  "intent": "",
  "related": []
}
`;

    const resp = await main(prompt);

    const match = resp.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;

    return {
      ...results,
      ai: parsed || {}
    };

  } catch (err) {
    console.error("AI enhance error:", err);
    return results;
  }
};