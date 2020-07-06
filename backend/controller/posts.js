const Post = require('../module/post');

exports.getPosts = (request ,response) => {

    const pageSize = +request.query.pagesize;
    const currentPage = +request.query.page;
    let fetchedPost ;
    
    const postQuery = Post.find();
    
    if(pageSize && currentPage ){
        postQuery
            .skip(pageSize*(currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then( documents => {
        fetchedPost = documents;
        return Post.count();
    })
    .then( count => {
        response.status(200).send({
            message: "Posts fetched succesfully!",
            posts: fetchedPost,
            maxPosts: count
        });
    }).catch(error => {
        response.status(500).json({
            message:"invalid authontication credentials!"
        })
    });
}

exports.getPost = (request , response) => {
    Post.findById(request.params.id).then( post => {
        if(post){
            response.status(200).send(post);
        }else{
            response.status(404).send({message:'Not Found'});
        }
    }).catch(error => {
        response.status(500).json({
            message:"invalid authontication credentials!"
        })
    });
}

exports.postDetails = (request ,response ,next) => {
    console.log("skjfksdjfjdf");
    const url = request.protocol + "://" + request.get("host");
    const post = new Post({
        title : request.body.title,
        content : request.body.content,
        imagePath : url + "/images/" + request.file.filename,
        creator: request.userData.userId
    });

    console.log(post);
    post.save().then(createdPost => {
        response.status(200).send({
            message : 'message' , 
            post : {
                ...createdPost,
                id :createdPost._id
            }
        });
    }).catch(error => {
        response.status(500).json({
            message:"Creating a post failed!"
        })
    });;
}

exports.updatePost = (request ,response) => {
   
    let imagePath = request.body.imagePath; 
    if (request.file) {
      const url = request.protocol + "://" + request.get("host");
      imagePath = url + "/images/" + request.file.filename
    }
    const post = new Post({
        _id : request.body.id,
        title : request.body.title,
        content : request.body.content,
        imagePath: imagePath,
        creator : request.userData.userId
    });
    Post.updateOne({ _id:request.params.id, creator:request.userData.userId } , post).then( result => {
        if(result.nModified > 0){  
            response.status(200).send({message:'Successfully posts updated'})
        }else{
            response.status(401).send({message:'Not Authonticated'});
        }
    })
    .catch(error => {
        response.status(500).json({
            message:"Coudn't update the post"
        })
    });
}

exports.deletePost = (request , response)=>{
    Post.deleteOne({ _id:request.params.id, creator:request.userData.userId }).then(result => {
         if(result.n > 0){
            response.status(200).send({message:'post was deleted'});
         }else{
            response.status(401).send({message:'Not Authonticated'});
         }
    });
}
