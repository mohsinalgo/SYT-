const express = require('express')
const router = express.Router()
const multer = require('multer')
const { create, getAll, getById, deleteById, updateById, likePost, getLikesByPost } = require('../controllers/post.controller')
const authenticateToken = require('../middleware/authenticate.middleware')

// multer.diskStorage
const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const unique = Date.now();
        const filename = `${file.fieldname}_${unique}_${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });


router.post('/', [authenticateToken, upload.single("image")], create);
router.get('/', authenticateToken, getAll);
router.get('/:id', authenticateToken, getById);
router.delete('/:id', authenticateToken, deleteById);
router.patch('/:id', authenticateToken, updateById);

router.post('/like/:id', authenticateToken, likePost);
router.get('/likes/:id', authenticateToken, getLikesByPost);



module.exports = router

