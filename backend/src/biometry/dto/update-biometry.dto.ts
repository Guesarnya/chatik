import { PartialType } from '@nestjs/mapped-types';
import { CreateBiometryDto } from './create-biometry.dto';

export class UpdateBiometryDto extends PartialType(CreateBiometryDto) {}
