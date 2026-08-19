import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { UserModule } from "./user/user.module";

export const modules = [
    UserModule,
    AuthModule,
    CoursesModule
]