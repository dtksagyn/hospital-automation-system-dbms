const Department = require('../models/department')

const DepartmentController = {
    async getAllDepartments(req,res){
        try {
            const departments = await Department.findAll();

            res.status(200).json(departments);
            
        } catch (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = DepartmentController;