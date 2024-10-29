import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const updateInvestigationSettings = async (investigationId, type, focus) => {
  try {
    const { error } = await supabase
      .from('investigations')
      .update({
        investigation_type: type,
        investigation_focus: focus
      })
      .eq('id', investigationId);

    if (error) throw error;
    toast.success('Investigation settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating investigation settings:', error);
    toast.error('Failed to update investigation settings');
    return false;
  }
};

export const processMessage = async (message, investigationId) => {
  const typeMatch = message.toLowerCase().match(/type:\s*(\w+)/);
  const focusMatch = message.toLowerCase().match(/focus:\s*(node_\w+)/);

  if (typeMatch || focusMatch) {
    const updates = {};
    if (typeMatch) updates.investigation_type = typeMatch[1];
    if (focusMatch) updates.investigation_focus = focusMatch[1];
    
    const success = await updateInvestigationSettings(investigationId, updates.investigation_type, updates.investigation_focus);
    return {
      success,
      wasCommand: true,
      response: success ? 
        "Settings updated successfully. How else can I help you?" :
        "Failed to update settings. Please try again."
    };
  }

  return { wasCommand: false };
};