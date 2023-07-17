const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('associates/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    console.log("Aquí estoy");
    const { name, phone, country, city, username,  password} = req.body;
    const newAssociated = {
        name,
        phone: phone.toString(),
        country,
        city,
        username,
        password,
        user_id: req.user.id
    };
    try {
        newAssociated.password = await helpers.encryptPassword(password);
        await pool.query('INSERT INTO associates SET ?', [newAssociated]);
        req.flash('success', 'Associated saved successfully');
        res.redirect('/associates');
      } catch (error) {
        console.error('Error while encrypting password:', error);
        req.flash('error', 'An error occurred');
        res.redirect('/associates');
      }
});

router.get('/', isLoggedIn, async(req, res) => {
    const associates = await pool.query('SELECT * FROM associates WHERE user_id = ?', [req.user.id]);
    res.render('associates/list',{ associates });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM associates WHERE ID = ?', [id]);
    req.flash('success', 'Associated removed successfully');
    res.redirect('/associates');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const associated = await pool.query('SELECT * FROM associates WHERE id = ?', [id]);
    res.render('associates/edit', { associated: associated[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { name, phone, country, city, username} = req.body;
    const newAssociated = {
        name,
        phone: phone.toString(),
        country,
        city,
        username,
        user_id: req.user.id
    };
    await pool.query('UPDATE associates set ? WHERE id = ?', [newAssociated, id]);
    req.flash('success', 'Associated updated successfuly')
    res.redirect('/associates')
});

module.exports = router;