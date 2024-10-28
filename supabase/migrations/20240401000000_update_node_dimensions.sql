-- Update existing nodes based on their visual style
UPDATE public.node 
SET width = 40, height = 40
WHERE visual_style = 'compact';

UPDATE public.node 
SET width = 40, height = 128
WHERE visual_style = 'default' OR visual_style IS NULL;

UPDATE public.node 
SET width = 256, height = 256
WHERE visual_style = 'postit';