
const express = require('express')
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


const apiEndpoint = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const adminSecret = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';



app.get('/api/blog-stats', async (req, res) => {
  try {
    
    const response = await axios.get(apiEndpoint, {
      headers: {
        'x-hasura-admin-secret': adminSecret,
      },
    });

    
    let blogData = response.data; 
    
    if (!Array.isArray(blogData)) {
      const blogObject = blogData;
      blogData = [blogObject];
    }
   console.log(blogData)
   
    const totalBlogs = blogData.length;
    const longestTitle = _.maxBy(blogData, 'title');
    const blogsWithPrivacy = blogData.filter(blog =>
     
      blog.title && typeof blog.title === 'string' && blog.title.toLowerCase().includes('privacy')
    );
    const uniqueTitles = _.uniqBy(blogData, 'title').map(blog => blog.title);

    
    res.json({
      totalBlogs,
      longestTitle:longestTitle ? longestTitle.title : '',
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles,
    });
  } catch (error) {
    
    
      res.status(500).json({ error: 'Internal Server Error' });
    }
  
});


app.get('/api/blog-search', async (req, res) => {
  try {
    
    const searchTerm = req.query.query;

    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required.' });
    }

    
    const response = await axios.get(apiEndpoint, {
      headers: {
        'x-hasura-admin-secret': adminSecret,
      },
    });

    
    const blogData = response.data; 

   
    const blogs = Array.isArray(blogData) ? blogData : [blogData];


    
    const matchingBlogs = blogs.filter(blog =>
      blog.title && typeof blog.title === 'string' && blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    res.json({ matchingBlogs });
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
