import { Category } from "../model/category.model.js";


export const saveCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename
        }
        const category = await Category.create(req.body)
        return category ? res.status(200).json({ message: "category save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const ViewCategory = async (req, res, next) => {
    try {
        let categories = await Category.find().sort({ sortorder: -1 })
        return categories ? res.status(200).json({ Category: categories, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
}
export const DeleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete({ _id: req.params.id })
        return (category) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error", status: false });
    }
}

export const saveSubCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename;
        }
        const category = await Category.findOne({ name: req.body.category });
        if (category) {
            const newSubCategory = {
                name: req.body.name,
                image: req.body.image,
                description: req.body.description,
            };
            category.subcategories.push(newSubCategory);
            const savedCategory = await category.save();
            return res.status(200).json({ message: "Subcategory saved successfully", status: true, category: savedCategory });
        } else {
            return res.status(404).json({ message: "Category not found", status: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error",status:false});
    }
};


