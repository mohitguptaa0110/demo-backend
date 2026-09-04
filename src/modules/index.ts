import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { SubjectsModule } from "./subjects/subjects.module";
import { UserModule } from "./user/user.module";

export const modules = [
    UserModule,
    AuthModule,
    CoursesModule,
    SubjectsModule
]