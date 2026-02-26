const Announcement = require('../models/Announcement');

// Get all active announcements
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Server error fetching announcements' });
    }
};

// Create a new announcement (Admin only)
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, description, type } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const announcement = new Announcement({
            title,
            description,
            type: type || 'general',
            createdBy: req.admin ? req.admin.id : null
        });

        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Server error creating announcement' });
    }
};

// Delete/Deactivate an announcement (Admin only)
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        announcement.isActive = false;
        await announcement.save();
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Server error deleting announcement' });
    }
};
