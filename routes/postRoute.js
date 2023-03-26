// @author: Amir Armion
// @version: V.01

const database = require("../fake-db");
const express  = require("express");
const router   = express.Router();

const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");


// ========================>> Creating a new post <<========================

// Step 1- Access to the form in the Browser
router.get("/create", ensureAuthenticated, (req, res) => {
  res.render("posts/createPost", {  dataUser: req.user });  
});

// Step 2- Sending form's data to the Server by clicking the "Create Post" button
router.post("/create", ensureAuthenticated, (req, res) => {

  const { title, link, description, subgroup } = req.body;

  const newSub  = subgroup.toLowerCase();
  const creator = req.user.id;

  const newLink = `https://${link}`;

  if(title.length === 0 || description.length == 0 || newLink.length === 0 || newSub.length === 0)
  {
    res.send(`<br>
              <h1>All fields should be filled!</h1>
              <br>
              <a href="/dashboard" class="btn btn-secondary">>> Home Dashboard</a>`);
  }
  else
  {
    database.addPost(title, newLink, creator, description, newSub);

    res.redirect("/announcement");
  }
});


// ========================>> Showing 20 most recent posts <<========================

router.get("/all-recent-posts", ensureAuthenticated, (req, res) => { 

  const allPosts         = database.getPosts(20);
  let   postMatchCreator = [];

  for(let index = 0; index < allPosts.length; index++)
  {
    postMatchCreator.push({ "postId": allPosts[index].id, "creatorName": database.getUser(allPosts[index].creator).uname })
  }

  res.render("posts/posts", { dataUser: req.user, allPosts, postMatchCreator });
});


// ========================>> Showing all my posts <<========================

router.get("/my-posts", ensureAuthenticated, (req, res) => { 

  const allPosts         = database.getPosts(100);
  let   postMatchCreator = [];

  for(let index = 0; index < allPosts.length; index++)
  {
    if(allPosts[index].creator === req.user.id)
    {
      postMatchCreator.push({ "postId": allPosts[index].id, "creatorName": database.getUser(allPosts[index].creator).uname })
    }
  }

  res.render("posts/allMyPosts", { dataUser: req.user, allPosts, postMatchCreator });
});


// ========================>> Showing a specific post <<========================

router.get("/show/:id", ensureAuthenticated, (req, res) => {

  const postId   = req.params.id;
  const thisPost = database.getPost(postId);
  const creator  = database.getUser(thisPost.creator.id);
  const time     = new Date(thisPost.timestamp);

  res.render("posts/show", { dataUser: req.user, thisPost, creator, time });
});


// ========================>> Editing a post <<========================

// Step 1- Access to the form in the Browser
router.get("/edit/:id", ensureAuthenticated, (req, res) => {

  const postId = req.params.id;

  res.render("posts/edit", {  dataUser: req.user, postId });  
});

// Step 2- Sending form's data (changes) to the Server by clicking the "Submit Edit" button
router.post("/edited/:id", ensureAuthenticated, (req, res) => {

  const { title, link, description, subgroup } = req.body;

  const postId = req.params.id;
  let   change = { 
    "title": title, 
    "link": link,
    "description": description,
    "subgroup": subgroup.toLowerCase()
  };

  database.editPost(Number(postId), change);

  res.redirect(`../../posts/show/${postId}`);
});


// ========================>> Deleting a post <<========================

// Step 1- Getting confirmation from user for deleting a post
router.get("/deleteConfirm/:id", ensureAuthenticated, (req, res) => {

  const postId = req.params.id;

  res.render("posts/deleteConfirm", {  dataUser: req.user, postId });  
});

// Step 2- Deleting the post
router.post("/delete/:id", ensureAuthenticated, (req, res) => {

  const postId   = req.params.id;
  const subgroup = database.getPost(postId).subgroup;

  database.deletePost(postId);

  res.redirect(`../../subs/show/${subgroup}`);  
});


// ========================>> Creating a comment for a post <<========================

router.post("/comment-create/:id", ensureAuthenticated, (req, res) => {

  const postId      = req.params.id;
  const { comment } = req.body;
  const creator     = req.user.id;

  if(comment.length === 0)
  {
    res.send(`<br>
              <h1>All fields should be filled!</h1>
              <br>
              <a href="../show/${postId}" class="btn btn-secondary">Back to the post</a>`);
  }
  else
  {
    database.addComment(postId, creator, comment);

    res.redirect(`../show/${postId}`);
  }
});

module.exports = router;
