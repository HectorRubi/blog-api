import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { EnvConfig } from 'src/env.model';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(configService: ConfigService<EnvConfig>) {
    const apiKey = configService.get('OPENAI_API_KEY', { infer: true });
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateSummary(content: string) {
    const response = await this.openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: 'Summarize the following text in a concise manner.',
      input: content,
    });
    return response.output_text;
  }

  async generateImage(text: string) {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: `Generate an image for the following description: ${text}`,
      size: '1024x1024',
    });

    if (!response.data?.[0]?.url) {
      throw new Error('Failed to generate image');
    }

    return response.data[0].url;
  }
}
