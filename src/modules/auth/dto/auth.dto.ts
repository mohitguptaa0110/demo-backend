import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail({},{message:'Please enter a valid email'})
    email!: string;

    @IsNotEmpty()
    @Matches(/^[0-9]{10}$/, {
        message: 'Phone number must be exactly 10 digits',
    })
    phone!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        {
            message:
                'Password must contain uppercase, lowercase, number and special character',
        },
    )
    password!: string;

    @IsNotEmpty()
    @IsString()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        {
            message:
                'Confirm Password must contain uppercase, lowercase, number and special character',
        },
    )
    confirmPassword!: string;
}

export class LoginDto {

    @IsNotEmpty()
    @IsEmail({},{message:'Please enter a valid email'})
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}