import Branch from "../models/branchSchema.js";
import User from "../models/userModel.js";
import logger from "../utils/logger.js";

export const testing = async (req, res) => {
    return res.send({message: 'Branch Controller is working!'});
}

export const createBranch = async (req, res) => {
    try {
        const userID = req.user._id;
        
        const {
            name,
            address,
            contactNumber,
            email
        } = req.body;
        
        const nameCheck = await Branch.findOne({name});
        if (nameCheck)
            return res.status(403).json({error: "Branch Name must be unique!"});
        
        const emailCheck = await Branch.findOne({email});
        if (emailCheck)
            return res.status(403).json({error: "Branch Email must be unique!"});
        
        const addressCheck = await Branch.findOne({address});
        if (addressCheck)
            return res.status(403).json({error: "Branch Address must be unique!"});
        
        const contactNumberCheck = await Branch.findOne({contactNumber});
        if (contactNumberCheck)
            return res.status(403).json({error: "Branch Contact Number must be unique!"});

        const newBranch = new Branch({
            name,
            address,
            contactNumber,
            email,
            addedBy: userID,
        });

        await newBranch.save();
        
        return res.json({message: `${name} Branch is created successfully!`});
    } catch (error) {
        logger.error(
            'Branch Creation Error',
            {
                error,
                route: 'create-branch',
                body: req.body
            }
        );
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const editBranch = async (req, res) => {
  try {
    const branchId = req.params.id; 
    const { name, address, contactNumber, email } = req.body;

    if (name) {
      const existingBranch = await Branch.findOne({ name, _id: { $ne: branchId } });
      if (existingBranch) return res.status(403).json({ error: "Branch Name must be unique!" });
    }
    if (address) {
      const existingBranch = await Branch.findOne({ address, _id: { $ne: branchId } });
      if (existingBranch) return res.status(403).json({ error: "Branch Address must be unique!" });
    }
    if (contactNumber) {
      const existingBranch = await Branch.findOne({ contactNumber, _id: { $ne: branchId } });
      if (existingBranch) return res.status(403).json({ error: "Branch Contact Number must be unique!" });
    }
    if (email) {
      const existingBranch = await Branch.findOne({ email, _id: { $ne: branchId } });
      if (existingBranch) return res.status(403).json({ error: "Branch Email must be unique!" });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      branchId,
      { name, address, contactNumber, email },
      { new: true, runValidators: true }
    );

    if (!updatedBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    return res.json({ message: "Branch updated successfully", branch: updatedBranch });
  } catch (error) {
    logger.error('Branch Edit Error', { error, route: 'edit-branch', body: req.body });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const {password} = req.body
    const userId = req.user._id;

    const user = await User.findById(userId)
    const passwordCheck = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordCheck)
        return res.status(403).json({message: "Invalid Operation! Password Mismatch"});

    const deletedBranch = await Branch.findByIdAndDelete(branchId);

    if (!deletedBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    return res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    logger.error('Branch Delete Error', { error, route: 'delete-branch' });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBranchInfo = async (req, res) => {
  try {
    const branchId = req.params.id;

    const branch = await Branch.findById(branchId).populate('-addedBy', '-password').exec();

    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    return res.json({ message: "Branch found successfully", branch });
  } catch (error) {
    logger.error('Branch Get Info Error', { error, route: 'get-branch-info' });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addUserToBranch = async (req, res) => {
  try {
    const { userId, branchId } = req.body;

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    
    user.branch = branchId;
    await user.save();

    return res.json({ message: `User ${user.username} assigned to branch ${branch.name} successfully.` });
  } catch (error) {
    logger.error('Add User to Branch Error', { error, route: 'add-user-to-branch', body: req.body });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const listBranches = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    
    const skip = (page - 1) * limit;

    
    const branches = await Branch.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    
    const totalBranches = await Branch.countDocuments();

    return res.json({
      message: "Branches fetched successfully",
      data: branches,
      pagination: {
        total: totalBranches,
        page,
        pages: Math.ceil(totalBranches / limit),
        limit
      }
    });
  } catch (error) {
    logger.error('List Branches Error', { error, route: 'list-branches', query: req.query });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




































