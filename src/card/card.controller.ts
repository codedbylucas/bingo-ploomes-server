import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';

@ApiTags('card')
@Controller('/card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a Card',
  })
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardService.createCard(createCardDto);
  }
}
