var express = require('express');
var router = express.Router();

//*-----------------
const mongo = require('mongodb')
const db  = require('monk')('localhost:27017/Blog_AppDB-2')

//*-----------
const {body,validationResult} = require('express-validator')

//*---------------------
const moment = require('moment')


/* GET home page. */
router.get('/', function(req, res, next) {

  let posts = db.get('posts')
  let categories = db.get('categories') 

  posts.find({},{},(err,post)=>{
    categories.find({},{},(err,category)=>{
      res.render('index',{posts:post,categories:category,moment:moment})
    })
  })
});

//TODO----------หน้าเพิ่มหมวดหมู่--------------------------------
router.get('/category/add',(req,res,next)=>{
  res.render('add_category')
})

//TODO----------หน้าเพิ่มบทความ--------------------------------
router.get('/post/add',(req,res,next)=>{
  let categories = db.get('categories') 

  categories.find({},{},(err,category)=>{
    res.render('add_post',{categories:category})
  })
})

//TODO----------Add category--------------------------------
router.post('/category/add',body('name','กรุณาระบุหมวดหมู่').not().isEmpty(),
                          (req,res,next)=>{
    const result = validationResult(req)
    const errors = result.errors
    let categories = db.get('categories')

    if(!result.isEmpty()){
      res.render('add_category',{errors:errors})
    }else{
      categories.insert({name:req.body.name},(err,category)=>{
        if(err) {
          res.send("Error")
        }else{
          res.redirect('/')
        }
      })
    }
})

//TODO----------Add post--------------------------------
router.post('/post/add',body('title','กรุณาระบุหมวดหมู่').not().isEmpty(),
                        body('content','กรุณาระบุหมวดหมู่').not().isEmpty(),
                        body('img','กรุณาระบุหมวดหมู่').not().isEmpty(),
                        body('author','กรุณาระบุหมวดหมู่').not().isEmpty(),
                          (req,res,next)=>{
    const result = validationResult(req)
    const errors = result.errors

    let categories = db.get('categories')
    let posts = db.get('posts')

    if(!result.isEmpty()){
      categories.find({},{},(err,category)=>{
        res.render('add_post',{errors:errors,categories:category})
      })
     
    }else{
      posts.insert({title:req.body.title,
        category:req.body.category,
        content:req.body.content,
        img:req.body.img,
        author:req.body.author,
        date: new Date()
      },(err,category)=>{
        if(err) {
          res.send("Error")
        }else{
          res.redirect('/')
        }
      })
    }
})


//TODO---------หน้าดูบทความ--------------------------------------
router.get('/show/:id',(req,res,next)=>{
  let categories = db.get('categories')
  let posts = db.get('posts')

  posts.find(req.params.id,{},(err,post)=>{
    categories.find({},{},(err,category)=>{
      res.render('show',{posts:post,categories:category,moment:moment})
    })
  })
})

//TODO---------สิ่งเดียวกัน--------------------------------------
router.get('/posts/search',(req,res,next)=>{
  let categories = db.get('categories')
  let posts = db.get('posts')

  let name_category = req.query.category
  let name_author   = req.query.author
  let name_title   = req.query.title

  if(name_category){
    posts.find({category:name_category},{},(err,post)=>{
      categories.find({},{},(err,category)=>{
        res.render('show_search',{posts:post,categories:category,moment:moment,name_search:name_category})
      })
    })
  }

  if(name_author){
    posts.find({author:name_author},{},(err,post)=>{
      categories.find({},{},(err,category)=>{
        res.render('show_search',{posts:post,categories:category,moment:moment,name_search:name_author})
      })
    })
  }

  if(name_title){
    posts.find({title:name_title},{},(err,post)=>{
      categories.find({},{},(err,category)=>{
        res.render('show_search',{posts:post,categories:category,moment:moment,name_search:name_title})
      })
    })
  }





})


module.exports = router;
