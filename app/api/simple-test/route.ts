import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();
    
    // Escribir a archivo para debugging
    const logData = {
      timestamp,
      body,
      headers: Object.fromEntries(request.headers.entries())
    };
    
    const logPath = join(process.cwd(), 'debug-log.json');
    writeFileSync(logPath, JSON.stringify(logData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Test exitoso',
      data: body,
      logPath: logPath
    });
    
  } catch (error) {
    const timestamp = new Date().toISOString();
    const errorData = {
      timestamp,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack'
    };
    
    const logPath = join(process.cwd(), 'debug-error.json');
    writeFileSync(logPath, JSON.stringify(errorData, null, 2));
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      logPath: logPath
    }, { status: 500 });
  }
}
