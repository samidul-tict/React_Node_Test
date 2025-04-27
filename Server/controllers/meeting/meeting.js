const MeetingHistory = require('../../model/schema/meeting')

const add = async (req, res) => {
    try {
        const data = req.body;
        data.createdDate = new Date();
        data.createBy = req.user.userId; // assuming you're using middleware to set req.user
        const meeting = new MeetingHistory(data);
        await meeting.save();
        res.status(200).json(meeting);
    } catch (err) {
        console.error('Failed to create meeting:', err);
        res.status(400).json({ error: 'Failed to create meeting' });
    }
}

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    let allData = await MeetingHistory.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);

    try {
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

const edit = async (req, res) => {
    try {
        let result = await MeetingHistory.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Meeting:', err);
        res.status(400).json({ error: 'Failed to Update Meeting' });
    }
}

const view = async (req, res) => {
    try {
        const { id } = req.params
        let meet = await MeetingHistory.findOne({ _id: id })
        .populate({
            path: 'createBy',   // field to populate
            select: 'firstName lastName username'  // fields you want to pick
        });

        if (!meet) return res.status(404).json({ message: "no Data Found." })
        res.send(meet)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error, err: 'An error occurred.' });
    }
}

const deleteData = async (req, res) => {
    try {
        const meet = await MeetingHistory.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", meet })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const meet = await MeetingHistory.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", meet })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { add, index, edit, view, deleteData, deleteMany }