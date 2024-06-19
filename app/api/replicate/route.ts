import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  const req = await request.json();
  const image = req.image;
  const theme = req.theme;
  const room = req.room;
  const customPrompt = req.customPrompt;
  const promptType = req.promptType;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
  });

  let model: `${string}/${string}:${string}`;
  let input: Record<string, any>;

  if (promptType === "colorChange") {
    model = 'jagilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b';
    input = {
      image,
      prompt: `${customPrompt}, A ${theme} ${room} Editorial Style Photo, Symmetry, Straight On, Modern Living Room, Large Window, Leather, Glass, Metal, Wood Paneling, Neutral Palette, Ikea, Natural Light, Apartment, Afternoon, Serene, Contemporary, 4k`,
      a_prompt: `best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning`,
    };
  } else if (promptType === "objectRemoval") {
    model = 'stability-ai/stable-diffusion-inpainting:95b72231npm';
    input = {
      image,
      mask: `${customPrompt}`, // The area to be inpainted
      prompt: `A ${theme} ${room} Editorial Style Photo, Symmetry, Straight On, Modern Living Room, Large Window, Leather, Glass, Metal, Wood Paneling, Neutral Palette, Ikea, Natural Light, Apartment, Afternoon, Serene, Contemporary, 4k`,
      negative_prompt: `remove objects`,
    };
  } else {
    return NextResponse.json({ error: 'Invalid prompt type' }, { status: 400 });
  }

  try {
    const output = await replicate.run(model, { input });
    console.log('Output', output);
    return NextResponse.json({ output }, { status: 201 });
  } catch (error) {
    console.error('Error running the model:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}