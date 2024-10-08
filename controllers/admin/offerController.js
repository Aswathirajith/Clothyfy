const Offer = require('../../models/offerdbModel');
const Product = require('../../models/productdbModel');
const Catergory = require('../../models/categorydbModel');

const offerLoad = async (req,res)=>{
    try {

        const page = parseInt(req.query.page) || 1; 
        const pageSize = 4; 
        const skip = (page - 1) * pageSize;

        const totalOrders = await Offer.countDocuments();
        const totalPages = Math.ceil(totalOrders / pageSize);

        const offerData = await Offer.find({})
        .sort({ date: -1 })
        .skip(skip)
        .limit(pageSize);
        res.render('admin/offers',{offerData:offerData,totalPages, currentPage: page})
    } catch (error) {
        res.render('admin/404error');
    }
}


const addOfferLoad = async (req,res)=>{
    try {
        res.render('admin/addOffer');
    } catch (error) {
        res.render('admin/404error');
    }
}



// add offer
const addOffer = async (req, res) => {
    try {
        const name = req.body.offerName;
        const description = req.body.offerDescription;
        const offerPercentage = req.body.offerPercentage;
        const validity = new Date(req.body.offerValidity);
        const currentDate = new Date();
        const type = req.body.offerType;
        const typeName = req.body.offerTypeName;

        if (!name || /^\s*$/.test(name)) {
            return res.json({ error: "Enter a valid offer name" });
        }

        if (!description || /^\s*$/.test(description) || description.trim().length < 5) {
            return res.json({ error: "Enter a valid offer description" });
        }

        if (!offerPercentage || offerPercentage > 100 || offerPercentage <= 0) {
            return res.json({ error: "Enter a valid offer percentage" });
        }

        if (!validity || validity < currentDate) {
            return res.json({ error: "Enter a valid date" });
        }

        if (!type || /^\s*$/.test(type)) {
            return res.json({ error: "Please select an offer type" });
        }

        if (!typeName || /^\s*$/.test(typeName)) {
            return res.json({ error: "Please select an offer typeName" });
        }

        const newOffer = new Offer({
            name: name,
            description: description,
            offerPercentage: offerPercentage,
            validity: validity,
            status: true,
            type: type,
            typeName: typeName
        });

          await newOffer.save();

        return res.json({message: " success"})

    } catch (error) {
        res.render('admin/404error');
    }
}

// change the status of offer
const changeOfferStatus = async (req, res) =>{
    try {
        
        const {offerId, newStatus} = req.params;

        let status;
        if (newStatus === 'activate') {
            status = true;
        } else if('deactivate'){
            status = false;
        }
        await Offer.findByIdAndUpdate({_id: offerId}, {status: status});

        res.json({success: true});

    } catch (error) {
        res.render('admin/404error');
    }
}

// delete offer
const deleteOffer = async (req, res) => {

    try {
        
        const offerId = req.query.offerId;
        
        const offerData = await Offer.findOne({_id: offerId});
        
        if (!offerData) {
            return res.json({ message: "No offers found" });
        }

        await Offer.deleteOne({_id: offerId});
        
        res.json({ message: "Offer deleted successfully" });

    } catch (error) {
        res.render('admin/404error');
    }
}

// to get products
const getProducts = async (req, res) => {
    try {

        const productData = await Product.find({ is_listed: true });
        const products = productData.map(product => product.prdctName);
        res.json({ products });

    } catch (error) {
        res.render("admin/404error");
    }
}

// to get categories
const getCategories = async (req, res) => {
    try {

        const categoryData = await Catergory.find({ is_listed: true });
        const categories = categoryData.map(category => category.cateName);
        res.json({ categories });

    } catch (error) {
        res.render('admin/404error');
    }
}
module.exports ={
    offerLoad,
    addOfferLoad,
    addOffer,
    changeOfferStatus,
    deleteOffer,
    getProducts,
    getCategories
}