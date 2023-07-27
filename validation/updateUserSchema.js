const yup = require("yup");
const genero = require("../utils/genero");

const updateUserSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
  sexo: yup
    .string()
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
  endereco: yup
    .string()
    .max(100, "O endereço deve ter no máximo 100 caracteres")
    .trim(),
});

module.exports = updateUserSchema;
