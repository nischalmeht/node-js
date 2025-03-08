const book = require("../Models/book");
const Book = require("../Models/book")

const getAllBooks=async(req,res)=>{
  

    try {
      const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 2;
    const skip = (page - 1) * limit;
    
    
        const allBooks = await book.find().skip(skip).limit(limit);
        const total = await book.countDocuments();
        console.log(total)
        res.json({
            total,
            page,
            pages: Math.ceil(total / limit),
            data: allBooks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getSingleBookById = async (req, res) => {
    try {
      const getCurrentBookID = req.params.id;
      const bookDetailsByID = await Book.findById(getCurrentBookID);
  
      if (!bookDetailsByID) {
        return res.status(404).json({
          success: false,
          message:
            "Book with the current ID is not found! Please try with a different ID",
        });
      }
  
      res.status(200).json({
        success: true,
        data: bookDetailsByID,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Something went wrong! Please try again",
      });
    }
  };
  
  const addNewBook = async (req, res) => {
    try {
      const newBookFormData = req.body;      
      const newlyCreatedBook = await Book.create(newBookFormData);
      if (newBookFormData) {
        res.status(201).json({
          success: true,
          message: "Book added successfully",
          data: newlyCreatedBook,
        });
      }
    } catch (e) {
      console.log(e,'65');
      res.status(500).json({
        success: false,
        message: "Something went wrong! Please try again",
      });
    }
  };
  
  const updateBook = async (req, res) => {
    try {
      const updatedBookFormData = req.body;
      const getCurrentBookID = req.params.id;
      const updatedBook = await Book.findByIdAndUpdate(
        getCurrentBookID,
        updatedBookFormData,
        {
          new: true,
        }
      );
  
      if (!updatedBook) {
        res.status(404).json({
          success: false,
          message: "Book is not found with this ID",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Something went wrong! Please try again",
      });
    }
  };
  
  const deleteBook = async (req, res) => {
    try {
      const getCurrentBookID = req.params.id;
      const deletedBook = await Book.findByIdAndDelete(getCurrentBookID);
  
      if (!deletedBook) {
        res.status(404).json({
          success: false,
          message: "Book is not found with this ID",
        });
      }
  
      res.status(200).json({
        success: true,
        data: deletedBook,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Something went wrong! Please try again",
      });
    }
  };
  
  module.exports = {
    getAllBooks,
    getSingleBookById,
    addNewBook,
    updateBook,
    deleteBook,
  };