const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

/* router.get('/edit', (req, res) => {
    res.render('sites/edit');
}); */

router.get('/list', isLoggedIn, async (req, res) => {
    const sitesQuery = `
            SELECT 
                s.PKSIT_NCODIGO,
                s.FKSIT_CUSER,
                u1.USE_CNAME AS UserFirstName,
                u1.USE_CLAST_NAME AS UserLastName,
                s.FKSIT_CUSER_EDIT,
                u2.USE_CNAME AS UserEditFirstName,
                u2.USE_CLAST_NAME AS UserEditLastName,
                s.SIT_CNAME,
                s.SIT_CDESCRIPTION,
                s.SIT_CIMGSOURCE,
                s.SIT_CREGISTRATION_DATE,
                s.SIT_CMODIFIED_DATE,
                s.SIT_CESTADO
            FROM 
                tbl_sites s
            LEFT JOIN
                tbl_users u1 ON s.FKSIT_CUSER = u1.PKUSE_NCODIGO
            LEFT JOIN
                tbl_users u2 ON s.FKSIT_CUSER_EDIT = u2.PKUSE_NCODIGO;
        `;

        // Ejecuta la consulta y espera a que se complete
        const sites = await pool.query(sitesQuery);
    res.render('sites/list', { sites });
})

router.post('/list', (req, res) => {
    res.render('sites/list');
});

router.get('/add', (req, res) => {
    res.render('/sites/add');
});

router.get('/list/edit/:id', isLoggedIn, async (req, res) => {
    console.log("acaaaaaaaaaaaa");
    const { id } = req.params;
    const site = await pool.query('SELECT * FROM tbl_sites WHERE PKSIT_NCODIGO = ?', [id]);
    res.render('/sites/list', { site: site[0] });
});

router.post('/list/edit/:id', async (req, res) => {
    console.log("acaaaaaaaaaaaa");
    const { id } = req.params;
    const { name, description, url, state } = req.body;
    const newSite = {
        SIT_CNAME: name,
        SIT_CDESCRIPTION: description,
        SIT_CIMGSOURCE: url,
        FKSIT_CUSER_EDIT: req.user.PKUSE_NCODIGO,
        SIT_CESTADO: state
    }
    await pool.query('UPDATE tbl_sites set ? WHERE PKSIT_NCODIGO = ?', [newSite, id]);
    req.flash('success', 'Link updated successfuly');
    res.redirect('/sites/list');
});



router.post('/add', isLoggedIn, async (req, res) => {
    const { name, description, url } = req.body;
    const newSite = {
        SIT_CNAME: name,
        SIT_CDESCRIPTION: description,
        SIT_CIMGSOURCE: url,
        FKSIT_CUSER: req.user.PKUSE_NCODIGO,
        SIT_CESTADO: "ACTIVO"
    };
    await pool.query('INSERT INTO tbl_sites set ?', [newSite]);
    req.flash('success', 'Site saved successfully');
    res.redirect('/sites/list');
});

module.exports = router;