import { Category } from "../model/category.model.js";
import { getCategoryHierarchy } from "../rolePermission/permission.js";


export const saveCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename
        }
        const category = await Category.create(req.body)
        return category ? res.status(200).json({ message: "category save successfully", status: true }) : res.status(400).json({ message: "something went wrong", status: false })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}
export const ViewCategory = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const adminDetail = await getCategoryHierarchy(userId);
        // const adminDetail = adminDetails.length === 1 ? adminDetails[0] : adminDetails;
        let categories = await Category.find().sort({ sortorder: -1 })
        return categories ? res.status(200).json({ Category: adminDetail, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
}
export const ViewCategoryById = async (req, res, next) => {
    try {
        let categories = await Category.findById({ _id: req.params.id }).sort({ sortorder: -1 })
        return categories ? res.status(200).json({ Category: categories, status: true }) : res.status(404).json({ error: "Not Found", status: false })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
}
export const DeleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete({ _id: req.params.id })
        return (category) ? res.status(200).json({ message: "delete successful", status: true }) : res.status(404).json({ error: "Not Found", status: false });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, status: false });
    }
}
export const UpdateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ error: 'category not found', status: false });
        }
        else {
            const updatedCategory = req.body;
            await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });
            return res.status(200).json({ message: 'Category Updated Successfully', status: true });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err, status: false });
    }
};

export const saveSubCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename;
        }
        const category = await Category.findOne({ _id: req.body.category });
        if (category) {
            const newSubCategory = {
                name: req.body.name,
                image: req.body.image,
                description: req.body.description,
                status: req.body.status
            };
            category.subcategories.push(newSubCategory);
            const savedCategory = await category.save();
            return res.status(200).json({ message: "Subcategory saved successfully", status: true, category: savedCategory });
        } else {
            return res.status(404).json({ message: "Category not found", status: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
};
export const updateSubCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename;
        }
        const { categoryId, subcategoryId } = req.params;
        const { name, image, description } = req.body;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found", status: false });
        }
        const subcategory = category.subcategories.id(subcategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found", status: false });
        }
        subcategory.name = name || subcategory.name;
        subcategory.image = image || subcategory.image;
        subcategory.description = description || subcategory.description;
        const updatedCategory = await category.save();
        return res.status(200).json({ message: "Subcategory updated successfully", status: true, category: updatedCategory, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}
export const deleteSubCategory = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found", status: false });
        }
        category.subcategories = category.subcategories.filter(sub => sub._id.toString() !== subcategoryId);
        const updatedCategory = await category.save();
        return res.status(200).json({ message: "Subcategory deleted successfully", status: true, category: updatedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error, status: false });
    }
}

