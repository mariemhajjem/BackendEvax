// check roles using accesscontrol
const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (() => {
ac.grant("admin")
.readAny('Users', ['*'])
.updateAny('Users', ['*'])
.deleteAny('Users', ['*'])

// ******** methodes to gtrant acces ********
// .extend("")  // extends from another role 
// .updateAny("")
// .deleteAny("")
// .readAny("")
 
ac.grant("enrolled")
 .extend("admin")
 
 
ac.grant("operator")


ac.grant("volunteer")
.extend("enrolled")

 
return ac ;
})();