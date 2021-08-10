import { InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'O campo nome não pode ser vazio.' })
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Informe um email valido.' })
  @IsNotEmpty({ message: 'O campo email não pode ser vazio.' })
  @IsOptional()
  email?: string;
}