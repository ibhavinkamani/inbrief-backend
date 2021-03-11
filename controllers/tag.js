const Tag = require('../models/tag');
const Blog = require('../models/blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const formidable = require('formidable');
const fs = require('fs');


exports.create = (req, res) => {
    let form = new formidable.IncomingForm(); //formidable
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {

        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded!'
            });
        }

        const { name, info } = fields;
        
        if (!name || name.length===0) {
            return res.status(400).json({
                error: 'Name is required!'
            });
        }

        if (!info || !info.length) {
            return res.status(400).json({
                error: 'Tag Information is required!'
            });
        }

        let tag = new Tag();

        tag.name = name;
        tag.slug = slugify(name).toLowerCase();
        tag.info = info;

        if(!files.image) {
            return res.status(400).json({
                error: 'Adding Tag Image is mandatory!'
            });
        }

        if (files.image) {
            if (files.image.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less then 1mb in size'
                });
            }
            tag.image.data = fs.readFileSync(files.image.path);
            tag.image.contentType = files.image.type;
        }

        tag.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {
    Tag.find({})
    .select('_id name slug')
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({ slug })
    .select('_id name slug info')
    .exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
     
        Blog.find({ tags: tag })
            .populate('categories', '_id name slug info')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug gist categories postedBy tags createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                Blog.find({ tags: tag })
                .populate('tags', '_id name slug')
                .sort({'updatedAt': -1})
                .limit(2)
                .populate('postedBy', '_id name username')
                .select('title slug tags postedBy createdAt updatedAt')
                .exec((err, topTwo) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Blogs not found'
                        });
                    }
                    res.json({ tag: tag, blogs: data, trendingBlogs: topTwo });
                });
            });
    });
};

exports.image = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Tag.findOne({ slug })
        .select('image')
        .exec((err, tag) => {
            if (err || !tag) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', tag.image.contentType);
            return res.send(tag.image.data);
        });
};
exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Tag deleted successfully'
        });
    });
};