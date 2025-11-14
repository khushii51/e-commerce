const roleMiddleware = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    if(!req.user ){
        return res.status(401).json({ message: "User not found!"})
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "You have not permission! "
       });
    }
    next();
  };
};

export default roleMiddleware;
