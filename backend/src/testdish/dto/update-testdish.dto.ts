import { PartialType } from '@nestjs/mapped-types';
import { CreateTestdishDto } from './create-testdish.dto';

export class UpdateTestdishDto extends PartialType(CreateTestdishDto) {}
