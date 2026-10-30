import {
    getAllStaffService,
    getStaffByIdService,
    createStaffService,
    updateStaffService,
    deleteStaffService,
    assignStaffServicesService,
    getStaffWorkingHoursService,
    setStaffWorkingHoursService,
    updateStaffWorkingHoursService
} from "../services/staff.service.js";

const getAllStaff = async (req, res, next) => {
    try {
        const businessId = req.user.businessId;
        const staff = await getAllStaffService(businessId);
        if (staff.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No staffs added yet"
            })
        }
        return res.status(200).json({
            success: true,
            data: staff
        })
    } catch (err) {
        next(err)
    }
}

const createStaff = async (req, res, next) => {
    try {
        const businessId = req.user.businessId;
        const newStaff = await createStaffService(businessId, req.body);

        return res.status(201).json({
            success: true,
            data: newStaff
        })
    } catch (err) {
        next(err)
    }
}

const updateStaff = async (req, res, next) => {
    try {
        const businessId = req.user.businessId;
        const staffId = req.staffId;
        const data = req.body;

        const existingStaff = await getStaffByIdService(businessId, staffId);
        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            })
        }

        const updatedStaff = await updateStaffService(businessId, staffId, data);
        if (!updatedStaff) {
            return res.status(404).json({
                success: false,
                message: "Failed to retrieve Staff"
            })
        }
        return res.status(200).json({
            success: true,
            data: updatedStaff
        })

    } catch (err) {
        next(err)
    }
}

const deleteStaff = async (req, res, next) => {
    try {
        const businessId = req.user.businessId;
        const staffId = req.staffId;

        const existingStaff = await getStaffByIdService(businessId, staffId);
        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            })
        }

        await deleteStaffService(businessId, staffId);
        return res.status(204).end()
    } catch (err) {
        next(err)
    }
}

const assignStaffServices = async (req, res, next) => {
    try {
        const { businessId } = req.user;
        const result = await assignStaffServicesService(
            businessId,
            req.staffId,
            req.serviceIds
        );

        if (result.status === 'staff-not-found') {
            return res.status(404).json({
                success: false,
                message: "Active staff member not found"
            });
        }

        if (result.status === 'services-not-found') {
            return res.status(404).json({
                success: false,
                message: "One or more active services were not found",
                serviceIds: result.unavailableServiceIds
            });
        }

        return res.status(200).json({
            success: true,
            data: result.assignments
        });
    } catch (err) {
        next(err);
    }
}

const getStaffWorkingHours = async (req, res, next) => {
    try {
        const { businessId } = req.user;
        const result = await getStaffWorkingHoursService(businessId, req.staffId);
        if (result.status === 'staff-not-found') {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.hours
        });
    } catch (err) {
        next(err);
    }
}

const setStaffWorkingHours = async (req, res, next) => {
    try {
        const { businessId } = req.user;
        const result = await setStaffWorkingHoursService(
            businessId,
            req.staffId,
            req.workingHours
        );
        if (result.status === 'staff-not-found') {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.hours
        });
    } catch (err) {
        next(err);
    }
}

const updateStaffWorkingHours = async (req, res, next) => {
    try {
        const { businessId } = req.user;
        const result = await updateStaffWorkingHoursService(
            businessId,
            req.staffId,
            req.workingHours
        );
        if (result.status === 'staff-not-found') {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result.hours
        });
    } catch (err) {
        next(err);
    }
}

export {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    assignStaffServices,
    getStaffWorkingHours,
    setStaffWorkingHours,
    updateStaffWorkingHours
};