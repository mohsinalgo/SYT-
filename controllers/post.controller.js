const { Sequelize } = require("../models");
const db = require("../models");
const Post = db.Post;
const User = db.User
const Likes = db.Likes
const { validatePost } = require('../models/post');
const { saveFileToS3, getFileFromS3 } = require("../services/fileUploadService");


// Create and Save a new Post
exports.create = async (req, res) => {

    const { error } = validatePost(req.body)
    if (error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        let postObj = {
            ...req.body,
            userId: req.user.id
        }
        if(req.file){
            const [ response, filename ] = await saveFileToS3(req.file)
            postObj.image = filename
        }
        const post = await Post.create(postObj)

        return res.status(201).json({ post });
    } catch (error) {
        console.log("Error: ", error)
        return res.status(400).json({ errors: error.message });
    }
};

exports.getAll = async (req, res) => {

    // let users = await User
    //        .findAll({
    //               include: [
    //                 { 
    //                     model: Post, 
    //                     as: 'posts' ,
    //                     // attributes: ["userName", "fullName"]
    //                 }
    //               ]
    //         })
    //         return res.status(200).json({ users });
    try {
        let posts = await Post
            .findAll({
                  include: [
                    { 
                        model: User, 
                        as: 'user' ,
                        attributes: ["userName", "fullName"]
                    },
                    { 
                        model: Likes,
                        // as: 'user' ,
                        attributes: ["id"]
                    }
                  ]
            })
        
        for (const post of posts) {
            if(post.image){
                const url = await getFileFromS3(post.image)
                post.image = url
            }
        }

        return res.status(200).json({ posts });
    } catch (error) {
        console.log("error: ", error)
        return res.status(400).json({ errors: error.message });
    }
}

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        let post = await Post
            .findOne({
                where: { id: id },
                include: [
                    { 
                        model: User, 
                        as: 'user' ,
                        attributes: ["userName", "fullName"]
                    },
                    { 
                        model: Likes,
                        // as: 'user' ,
                        attributes: ["id"]
                    }
                ]
            })
        if (post == null) {
            return res.status(404).json({ errors: [{ message: "Post does not exist..." }] });
        }
        return res.status(200).json({ post });
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
}

exports.deleteById = async (req, res) => {
    const { id } = req.params;

    try {
        let post = await Post.findOne({ where: { id }});
        if (post == null) {
            return res.status(404).json({ errors: [{ message: "Post does not exist..." }] });
        }

        if(req.user.id != post.userId){
            return res.status(403).send({ status: "error", msg: "You are not authorized to delete this post" });
        }

        let deletedPost = await Post.destroy({ where: { id }});
        if(deletedPost){
            return res.status(200).json({ success: "Post Deleted Successfully", deletedPost });
        }

    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
}

exports.updateById = async (req, res) => {
    const { id } = req.params;
    const query = req.body
    
    try {
        let post = await Post.findOne({ where: { id }});
        if (post == null) {
            return res.status(404).json({ errors: [{ message: "Post does not exist..." }] });
        }

        if(req.user.id != post.userId){
            return res.status(403).send({ status: "error", msg: "You are not authorized to update this post" });
        }

        let updatedPost = await await Post.update(query, { where: { id }});
        if(updatedPost){
            return res.status(200).json({ success: "Post Updated Successfully", updatedPost });
        }


    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
}


exports.likePost = async (req, res) => {
    const { id } = req.params;

    try {
        isPostExist = await Post.count({
            where: { id }
        })

        if(!isPostExist){
            return res.status(404).json({ errors: [{ message: "Post does not exist..." }] });
        }

        let like = await Likes.findOne({ where: { userId: req.user.id, postId: id } })
        if(!like){
            const likedPost = await Likes.create({
                userId: req.user.id, 
                postId: id
            })
            return res.status(200).json({ success: "Post liked successfully", likedPost });
        }
        else{
            const dislikedPost = await Likes.destroy({ where: { userId: req.user.id, postId: id } })
            return res.status(200).json({ success: "Post disliked successfully", dislikedPost });
        }
    
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
}


exports.getLikesByPost = async (req, res) => {
    const { id } = req.params;

    try {
        isPostExist = await Post.count({
            where: { id }
        })

        if(!isPostExist){
            return res.status(404).json({ errors: [{ message: "Post does not exist..." }] });
        }
        let likes = await Likes.findAll({
            where: {
                postId: id
            },
            attributes: ["id"],
            include: [
                { 
                    model: User, 
                    as: 'user' ,
                    attributes: ["userName", "fullName"]
                }
            ]
        })

        return res.status(200).json({ success: 1, likes });
        
    } catch (error) {
        return res.status(400).json({ errors: error.message });
    }
}


