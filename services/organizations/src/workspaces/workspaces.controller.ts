import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";

// TODO: Agregar JwtAuthGuard cuando configuremos la estrategia en este servicio
// @UseGuards(JwtAuthGuard)
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(@Req() req, @Body() body: { name: string; slug?: string }) {
    // Temporal: Obtener userID de headers o token decodificado
    // Por ahora simulamos que viene en el body o header 'x-user-id' puesto por el gateway
    const userId = req.headers["x-user-id"] || "temp-user-id"; 
    return this.workspacesService.create(userId, body.name, body.slug);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.headers["x-user-id"] || "temp-user-id";
    return this.workspacesService.findAllForUser(userId);
  }
}
