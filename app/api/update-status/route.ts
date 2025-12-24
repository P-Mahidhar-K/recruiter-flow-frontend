import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
    const { applicationId, stageIndex, status } = await req.json();

    // Fetch current application
    const { data: app } = await supabase
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .single();

    if (!app) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    /* ===== FAILED ===== */
    if (status === "FAILED") {
        await supabase
            .from("applications")
            .update({
                status: "REJECTED",
                failed_stage_index: stageIndex,
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    /* ===== PASSED ===== */
    if (status === "PASSED") {
        await supabase
            .from("applications")
            .update({
                current_stage_index: stageIndex + 1,
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    /* ===== HIRED ===== */
    if (status === "HIRED") {
        await supabase
            .from("applications")
            .update({
                status: "HIRED",
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    /* ===== REJECTED FROM OFFER ===== */
    if (status === "REJECTED") {
        await supabase
            .from("applications")
            .update({
                status: "REJECTED",
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicationId);

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
}
