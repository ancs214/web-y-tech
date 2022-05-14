const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//Get all posts  -  api/posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at',
            'post_user_id'
        ],
        include: [
            // include the Comment model
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                //to show username of user who made the comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                //to show username of user who created the post
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get single blog post   -  /api/posts/id
router.get('/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            //to retrieve id of requested post
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at',
            'post_user_id'
        ],
        include: [
            // include the Comment model
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                //show username of user who made the comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                //show username of user who created the post
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//CREATE POST  -  api/posts
router.post('/', withAuth, (req, res) => {
    // expects title, post_content
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        post_user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//UPDATE A POST
router.put('/:id', withAuth, (req, res) => {
    Post.update(req.body,
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


  //DELETE A POST
  router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

module.exports = router;