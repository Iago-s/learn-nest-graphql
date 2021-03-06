import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'O campo nome não pode ser vazio.' })
  name: string;

  @IsEmail({}, { message: 'Informe um email valido.' })
  @IsNotEmpty({ message: 'O campo email não pode ser vazio.' })
  email: string;
}