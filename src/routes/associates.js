const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn } = require('../lib/auth');

router.get('/list', isLoggedIn, async (req, res) => {
    const associates = await pool.query('SELECT * FROM tbl_associates WHERE FKASS_CUSER = ?', [req.user.PKUSE_NCODIGO]);
    const totalAssociates = associates.length;
    res.render('associates/list', { associates, totalAssociates });
});

router.post('/list', (req, res) => {
    res.render('associates/list');
});

router.get('/add', (req, res) => {
    res.render('/associates/add');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    console.log("acaaaaaaaaaaaa");
    const { id } = req.params;
    const associated = await pool.query('SELECT * FROM tbl_associates WHERE PKASS_NCODIGO = ?', [id]);
    res.render('associates/edit', { associated: associated[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, lastName, state } = req.body;
    console.log(req.body);
    const newAssociated = {
        ASS_CNAME: name,
        ASS_CLAST_NAME: lastName,
        ASS_CESTADO: state,
        FKASS_CUSER: req.user.PKUSE_NCODIGO
    }
    await pool.query('UPDATE tbl_associates set ? WHERE PKASS_NCODIGO = ?', [newAssociated, id]);
    req.flash('success', 'Link updated successfuly')
    res.redirect('/associates/list')
});



router.post('/add', isLoggedIn, async (req, res) => {
    const { name, lastName, state } = req.body;
    const newAssociated = {
        ASS_CNAME: name,
        ASS_CLAST_NAME: lastName,
        ASS_CESTADO: state,
        FKASS_CUSER: req.user.PKUSE_NCODIGO,
        ASS_CESTADO: "ACTIVO"
    };
    await pool.query('INSERT INTO tbl_associates set ?', [newAssociated]);
    req.flash('success', 'Associated saved successfully');
    res.redirect('/associates/list');
});

module.exports = router;
