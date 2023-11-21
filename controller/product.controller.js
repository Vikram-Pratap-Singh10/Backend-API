import axios from "axios";

export const ProductXml = async (req, res) => {
    const fileUrl = "https://awsxmlfiles.s3.ap-south-1.amazonaws.com/CreateProduct.xml";
    try {
        const response = await axios.get(fileUrl);
        const data = response.data;
        return res.status(200).json({ data, status: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error reading the file");
    }
};