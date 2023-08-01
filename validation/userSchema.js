const yup = require("yup");
const genero = require("../utils/genero");

const CPF_REGEX = /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2})|([0-9]{11}))$/;
const BIRTH_REGEX = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const userSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .min(2, "O nome deve ter no minimo 2 caracters")
    .max(50, "O nome deve ter no máximo 60 caracters")
    .required("O nome é obrigatório"),
  username: yup.string().required("O username é obrigatório"),
  email: yup
    .string()
    .email("Insira um email válido")
    .required("O email é obrigatório"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^\w]/, {
      message: "Password must contain at least one special character",
      excludeEmptyString: true,
    })
    .test("noSpaces", "Password must not contain spaces", (value) => {
      return !/\s/.test(value);
    })
    .required("A senha é obrigatória"),
  cpf: yup
    .string()
    .matches(
      CPF_REGEX,
      "O formato do cpf deve ser xxx.xxx.xxx-xx ou 11 números"
    )
    .required("O cpf é obrigatório"),
  sexo: yup
    .string()
    .required("O sexo é obrigatório")
    .oneOf(
      [
        genero.Feminino,
        genero.Masculino,
        genero.NaoBinario,
        genero.Outros,
        genero.PrefiroNaoInformar,
      ],
      "Sexo deve ser: Feminino, Masculino, Não Binário, Outros ou Prefiro Não Informar"
    ),
  birth: yup
    .string()
    .matches(BIRTH_REGEX, "O formato da data de nascimento deve ser DD/MM/YYYY")
    .required("A data de nascimento é obrigatório"),
});

module.exports = userSchema;
