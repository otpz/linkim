const yup = require('yup')

const schema = yup.object().shape({
    name: yup.string("Rakam kullanmayınız.").required("İsim alanı zorunludur.").min(2, "İsim en az 2 karakter olmalıdır."),
    surname: yup.string("Rakam kullanmayınız.").required("Soyisim alanı zorunludur.").min(2, "Soyisim en az 2 karakter olmalıdır."),
    email: yup.string().email("Geçersiz email.").required("Email alanı zorunludur.").matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Geçerli bir email adresi giriniz."),
    password: yup.string().min(8, "Şifreniz en az 8 karakterden oluşmalıdır.").required("Şifre alanı zorunludur.").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+[\]{}|;':",.?/\\-_=]+$/,"Şifre bir büyük, bir küçük harf ve 1 rakam içermelidir."),
    username: yup.string().required("Kullanıcı adı alanı zorunludur").min(3, "Kullanıcı adınız en az 3 karakter olmalıdır."),
    biography: yup.string().max(300,"Biyografi en fazla 300 karakterden oluşmalıdır.")
})

const schemaSettings = yup.object().shape({
    name: yup.string("Rakam kullanmayınız.").required("İsim alanı zorunludur.").min(2, "İsim en az 2 karakter olmalıdır."),
    surname: yup.string("Rakam kullanmayınız.").required("Soyisim alanı zorunludur.").min(2, "Soyisim en az 2 karakter olmalıdır."),
    email: yup.string().email("Geçersiz email.").required("Email alanı zorunludur.").matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Geçerli bir email adresi giriniz."),
    username: yup.string().required("Kullanıcı adı alanı zorunludur").min(3, "Kullanıcı adınız en az 3 karakter olmalıdır."),
    biography: yup.string().max(300,"Biyografi en fazla 300 karakterden oluşmalıdır.")
})

const schemaResetPassword = yup.object().shape({
    password: yup.string().min(8, "Şifreniz en az 8 karakterden oluşmalıdır.").required("Şifre alanı zorunludur.").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+[\]{}|;':",.?/\\-_=]+$/,"Şifre bir büyük, bir küçük harf ve 1 rakam içermelidir."),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Yeni şifreler uyuşmuyor.').required('Yeni şifreyi tekrar giriniz.')
})

module.exports = {schema, schemaSettings, schemaResetPassword}