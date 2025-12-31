import { supabase } from "@/lib/supabase";

export const uploadFile = async (
    file: File,
    user: { username: string },
    credentials: { username: string; hash: string }
) => {
    // 1. Upload to Storage
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const filePath = `${user.username}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Create DB Record
    const { data: newId, error: rpcError } = await supabase.rpc('api_create_paste', {
        p_username: credentials.username,
        p_hash: credentials.hash,
        p_content: '',
        p_language: ext || 'binary',
        p_title: file.name,
        p_description: 'Uploaded file',
        p_is_public: true,
        p_mime_type: file.type,
        p_storage_path: filePath
    });

    if (rpcError) throw rpcError;

    return newId;
};
