// @author: Amir Armion
// @version: V.01

const express  = require("express");
const router   = express.Router();
const database = require("../fake-db");

const { ensureAuthenticated } = require("../middleware/checkAuth");


// ========================>> Showing all subgroups <<========================

router.get("/list", ensureAuthenticated, (req, res) => {
  
    const allSubs = database.getSubs();

    res.render("subs/subs", { dataUser: req.user, allSubs });
});


// ========================>> Showing all posts related to a specific subgroup <<========================

router.get("/show/:subgroup", ensureAuthenticated, (req, res) => {

    const subgroup = req.params.subgroup;
    const allPosts = database.getPosts(100);

    let postMatchCreator = [];
  
    for(let index = 0; index < allPosts.length; index++)
    {
      postMatchCreator.push({ "postId": allPosts[index].id, "creatorName": database.getUser(allPosts[index].creator).uname })
    }

    res.render("subs/show", { dataUser: req.user, allPosts, subgroup, postMatchCreator });
});

module.exports = router;
