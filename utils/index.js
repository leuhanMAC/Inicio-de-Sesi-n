import bcrypt from 'bcrypt';

export const createHash = (password) => {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null
    );
};

export const comparePassword = (password1, password2) => {
    return bcrypt.compareSync(password1, password2);
}