const imagekit = require("../config/lib/imagekit");
const prisma = require("../config/prisma");
const { upload } = require("../config/storage");
const { encode } = require("base-64");

const index = async (req, res) => {
  const result = await prisma.posts.findMany();
  console.log(encode(process.env.PRIVATE_KEY_IMAGE_KIT));
  res.json({
    message: "GET Post API",
    data: result,
  });
};

const detail = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await prisma.posts.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: "data retrieved",
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: error,
    });
  }
};

const create = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    console.log(req.body);
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({
        message: "Missing file for upload",
      });
    }

    try {
      const { title, desc } = req.body;

      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const result = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "binar-chsix",
        tags: ["testupload"],
      });

      const post = await prisma.posts.create({
        data: {
          title,
          desc,
          url_image: result.url,
          imagekit_fileId: result.fileId,
        },
      });

      res.status(201).json({
        message: "Post created successfully!",
        data: post,
      });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .json({ message: "Failed to create post", error: error.message });
    }
  });
};

const updatePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, desc } = req.body;
    console.log(id, req.body);
    const checkId = await prisma.posts.findUnique({
      where: {
        id: id,
      },
    });
    const updatedData = {
      title: title || checkId.title,
      desc: desc || checkId.desc,
    };
    const updatePost = await prisma.posts.update({
      where: { id: id },
      data: updatedData,
    });
    res
      .status(200)
      .json({ status: "Post updated successfully", data: updatePost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    console.log(id);
    const post = await prisma.posts.findUnique({
      where: {
        id: id,
      },
    });
    console.log(post);
    if (!post) {
      return res.status(400).json({
        message: `there is no post with ${id} id`,
      });
    }

    const fileId = post.imagekit_fileId;
    console.log(fileId);

    await imagekit.deleteFile(fileId);

    await prisma.posts.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Post has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400);
  }
};

module.exports = {
  index,
  create,
  detail,
  deletePost,
  updatePost,
};
