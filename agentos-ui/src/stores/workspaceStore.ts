import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  status: 'provisioning' | 'active' | 'archived' | 'deleted';
  region?: string;
  template?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  templateId?: string;
}

export interface Template {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  spec: Record<string, boolean>;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentWorkspaceId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkspaces: () => Promise<void>;
  fetchTemplates: () => Promise<Template[]>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentWorkspaceById: (id: string) => void;
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  archiveWorkspace: (id: string) => Promise<void>;
  restoreWorkspace: (id: string) => Promise<void>;
  clearError: () => void;
}

const mockWorkspaces = [
  {
    id: 'ws-1',
    name: 'platform',
    displayName: 'Platform Engineering',
    description: 'Core platform infrastructure',
    status: 'active' as const,
    region: 'us-east-1',
    templateId: 'tpl-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    ownerId: 'usr_1',
  },
  {
    id: 'ws-2',
    name: 'ml-training',
    displayName: 'ML Training',
    description: 'Machine learning model training workspace',
    status: 'active' as const,
    region: 'us-west-2',
    templateId: 'tpl-2',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
    ownerId: 'usr_1',
  },
  {
    id: 'ws-3',
    name: 'data-processing',
    displayName: 'Data Processing',
    description: 'ETL pipelines and data pipelines',
    status: 'provisioning' as const,
    region: 'eu-west-1',
    templateId: 'tpl-3',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
    ownerId: 'usr_1',
  },
];

export interface WorkspaceTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  spec: Record<string, unknown>;
}

const mockTemplates: Template[] = [
  {
    id: 'tpl-1',
    name: 'platform-engineering',
    displayName: 'Platform Engineering',
    description: 'Kubernetes, CI/CD, monitoring, and infrastructure as code',
    category: 'Infrastructure',
    icon: '⚙️',
    color: '#7c6cf5',
    spec: { kubernetes: true, monitoring: true, cicd: true },
  },
  {
    id: 'tpl-2',
    name: 'ml-training',
    displayName: 'ML Training',
    description: 'GPU clusters, experiment tracking, model registry',
    category: 'Machine Learning',
    icon: '🤖',
    color: '#ff4d6d',
    spec: { gpu: true, mlflow: true, registry: true },
  },
  {
    id: 'tpl-3',
    name: 'data-processing',
    displayName: 'Data Processing',
    description: 'Spark, Kafka, Airflow, and data quality tools',
    category: 'Data Engineering',
    icon: '📊',
    color: '#ffb347',
    spec: { spark: true, kafka: true, airflow: true },
  },
  {
    id: 'tpl-4',
    name: 'web-application',
    displayName: 'Web Application',
    description: 'React, Next.js, GraphQL, and deployment pipeline',
    category: 'Development',
    icon: '🌐',
    color: '#00e5ff',
    spec: { react: true, nextjs: true, graphql: true },
  },
];

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: mockWorkspaces,
      currentWorkspace: mockWorkspaces[0],
      currentWorkspaceId: mockWorkspaces[0].id,
      isLoading: false,
      error: null,

      fetchWorkspaces: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          // Workspaces are already loaded from mock data
          set({ isLoading: false });
        } catch {
          set({ error: 'Failed to fetch workspaces', isLoading: false });
        }
      },

      fetchTemplates: async () => {
        // Templates are in mock data
        return mockTemplates;
      },

      setCurrentWorkspace: (workspace) => {
        set({ 
          currentWorkspace: workspace,
          currentWorkspaceId: workspace?.id || null,
        });
      },

      setCurrentWorkspaceById: (id) => {
        const workspace = get().workspaces.find(w => w.id === id);
        if (workspace) {
          set({ 
            currentWorkspace: workspace,
            currentWorkspaceId: workspace.id,
          });
        }
      },

      createWorkspace: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const newWorkspace = {
            id: `ws-${Date.now()}`,
            name: data.name || '',
            displayName: data.displayName || data.name || '',
            description: data.description,
            status: 'provisioning' as const,
            region: data.region || 'us-east-1',
            templateId: data.templateId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ownerId: 'usr_1',
          };
          
          set(state => ({
            workspaces: [...state.workspaces, newWorkspace],
            currentWorkspace: newWorkspace,
            currentWorkspaceId: newWorkspace.id,
            isLoading: false,
          }));
          
          return newWorkspace;
        } catch (error) {
          set({ error: 'Failed to create workspace', isLoading: false });
          throw error;
        }
      },

      updateWorkspace: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set(state => ({
            workspaces: state.workspaces.map(w => 
              w.id === id ? { ...w, ...data, updatedAt: new Date().toISOString() } : w
            ),
            currentWorkspace: state.currentWorkspace?.id === id 
              ? { ...state.currentWorkspace, ...data, updatedAt: new Date().toISOString() }
              : state.currentWorkspace,
            isLoading: false,
          }));
        } catch (error) {
          set({ error: 'Failed to update workspace', isLoading: false });
          throw error;
        }
      },

      deleteWorkspace: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set(state => {
            const newWorkspaces = state.workspaces.filter(w => w.id !== id);
            return {
              workspaces: newWorkspaces,
              currentWorkspace: state.currentWorkspace?.id === id 
                ? (newWorkspaces[0] || null)
                : state.currentWorkspace,
              currentWorkspaceId: state.currentWorkspaceId === id
                ? (newWorkspaces[0]?.id || null)
                : state.currentWorkspaceId,
              isLoading: false,
            };
          });
        } catch (error) {
          set({ error: 'Failed to delete workspace', isLoading: false });
          throw error;
        }
      },

      archiveWorkspace: async (id) => {
        await get().updateWorkspace(id, { status: 'archived' });
      },

      restoreWorkspace: async (id) => {
        await get().updateWorkspace(id, { status: 'active' });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'hermes-workspace',
      partialize: (state) => ({
        workspaces: state.workspaces,
        currentWorkspaceId: state.currentWorkspaceId,
      }),
    }
  )
);
