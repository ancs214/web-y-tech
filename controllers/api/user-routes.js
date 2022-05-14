const router = require('express').Router();
const { User, Post, Comment } = require('../../models');



// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method) 
    //findAll is like 'SELECT * FROM users'
    User.findAll({
      //instructed the query to exclude the password column
      attributes: { exclude: ['password'] }
    })
        //respond in json format
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET A SINGLE USER
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
          id: req.params.id
        },
        include: [
            {
                //include all posts made by user
                model: Post,
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                //along with comments on that post
                model: Comment,
                attributes: ['id', 'comment_text'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            //if user does not exist, respond w 404 status
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})


//CREATE A USER
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(dbUserData => {
        res.json(dbUserData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

//LOGIN 


//LOGOUT 


//UPDATE USER INFO


//DELETE A USER



module.exports = router;