import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { Admin } from "@/models"; // or User model if you prefer
import role from "@/models/role";

// Local strategy: use username or email; adapt to your login field
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (username, password, done) => {
      try {
        const admin = await Admin.findOne({
          $or: [
            { username: username.toLowerCase() },
            { email: username.toLowerCase() },
          ],
        })
          .select("+password")
          .populate({
            path: "roleId",
            select: "name permissions",
            populate: {
              path: "permissions",
              select: "code -_id",
            },
          })
          .populate({
            path: "branchIds",
            select: "name",
          })
          .orFail();

        if (!admin || !admin.password) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const ok = await bcrypt.compare(password, admin.password);
        if (!ok) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Sanitize user session payload
        const sessionUser = {
          id: String(admin._id),
          name: admin.name,
          username: admin.username,
          email: admin.email,
          roleId: admin.roleId as any,
          branchIds: admin.branchIds,
        };

        return done(null, sessionUser);
      } catch (err) {
        return done(err as any);
      }
    }
  )
);

// Minimal serialize/deserialize; store small object in session to avoid extra DB hits
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async(user:any, done) => {
   try {
   const admin = await Admin.findOne({
            _id: user.id,
        })
          .select("-password")
          .populate({
            path: "roleId",
            select: "name permissions",
            populate: {
              path: "permissions",
              select: "code -_id",
            },
          })
          .populate({
            path: "branchIds",
            select: "name",
          })
          .orFail();
        if (!admin ) {
          return done(null, false);
        }

        

    return done(null, admin as any);
  } catch (err) {
    return done(err);
  }
  });

export default passport;
export const initializePassport = [passport.initialize(), passport.session()];
